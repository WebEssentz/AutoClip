// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/src/db';
import { Users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { sendSubscriptionEmail } from '@/lib/email';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Get current UTC time
  const now = new Date('2025-01-01 13:19:23');
  console.log('Current UTC time:', now.toISOString());

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer details using Stripe API
        const customer = await stripe.customers.retrieve(session.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;
        const customerName = (customer as Stripe.Customer).name || 'Onyerikam';

        if (!customerEmail) {
          throw new Error('No customer email found');
        }

        // Get current user data
        const currentUser = await db
          .select()
          .from(Users)
          .where(eq(Users.email, customerEmail));

        if (!currentUser[0]) {
          throw new Error('User not found');
        }

        // Calculate new credits
        const currentCredits = currentUser[0].credits ?? 30;
        const newCredits = Math.max(currentCredits, 100);

        console.log('Processing subscription:', {
          event: event.type,
          customer: customerName,
          email: customerEmail,
          currentCredits,
          newCredits,
          timestamp: now.toISOString()
        });

        // Update subscription status
        const updateResult = await db.update(Users)
          .set({
            subscription: true,
            subscriptionId: session.subscription as string,
            currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            credits: newCredits,
            lastCreditReset: now,
            updatedAt: now
          })
          .where(eq(Users.email, customerEmail))
          .returning();

        console.log('Database update result:', updateResult);

        // Send welcome email
        await sendSubscriptionEmail(customerEmail, {
          customerName,
          planName: 'Premium',
          amount: 30,
          nextBilling: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          invoiceUrl: `https://dashboard.stripe.com/invoices/${session.invoice}`,
          currentCredits: newCredits
        });

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerEmail = (invoice.customer_email || '').toString();

        if (!customerEmail) {
          throw new Error('No customer email found in invoice');
        }

        const currentUser = await db
          .select()
          .from(Users)
          .where(eq(Users.email, customerEmail));

        if (!currentUser[0]) {
          throw new Error('User not found');
        }

        const currentCredits = currentUser[0].credits ?? 30;
        const newCredits = Math.max(currentCredits, 100);

        console.log('Processing recurring payment:', {
          event: event.type,
          email: customerEmail,
          currentCredits,
          newCredits,
          timestamp: now.toISOString()
        });

        await db.update(Users)
          .set({
            currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            credits: newCredits,
            lastCreditReset: now,
            updatedAt: now
          })
          .where(eq(Users.email, customerEmail));

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
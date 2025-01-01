// app/api/stripe/create-subscription/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/src/db';
import { Users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create or get Stripe customer
    let customer;
    const existingUser = await db.select().from(Users)
      .where(eq(Users.email, email));

    if (existingUser[0]?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(existingUser[0].stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email,
        name,
      });

      await db.update(Users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(Users.email, email));
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
      metadata: {
        userId: existingUser[0]?.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
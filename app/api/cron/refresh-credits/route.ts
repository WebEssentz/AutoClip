import { db } from '@/src/db';
import { Users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Update all non-subscribed users to have 30 credits
    await db
      .update(Users)
      .set({
        credits: 30,
        updatedAt: new Date()
      })
      .where(
        eq(Users.subscription, false)
      );

    return NextResponse.json({
      success: true,
      message: 'Monthly credits refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing credits:', error);
    return NextResponse.json(
      { error: 'Failed to refresh credits' },
      { status: 500 }
    );
  }
}
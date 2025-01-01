// app/api/credits/refresh/route.ts
import { db } from '@/src/db';
import { Users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Update free users to 30 credits
    await db
      .update(Users)
      .set({
        credits: 30,
        updatedAt: new Date()
      })
      .where(
        eq(Users.subscription, false)
      );

    // Update premium subscribers to 100 credits
    await db
      .update(Users)
      .set({
        credits: 100,
        updatedAt: new Date()
      })
      .where(
        eq(Users.subscription, true)
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
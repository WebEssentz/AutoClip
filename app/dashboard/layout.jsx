"use client";

import React, { useEffect, useState } from 'react';
import Header from './_components/Header';
import SideNav from './_components/SideNav';
import { VideoDataContext } from '../_context/VideoDataContext';
import { UserDetailContext } from '../_context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import { Users } from '@/src/db/schema';
import { db } from '@/src/db';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { NavSkeleton, SideNavSkeleton } from '@/components/LoadingSkeleton';

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize user data and check credits
  const initializeUserData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      // Fetch user details first
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, user.primaryEmailAddress.emailAddress));

      const userData = result[0];
      if (!userData) return;

      // Set user details immediately
      setUserDetail(userData);

      // Check and update credits if needed
      const now = new Date('2025-01-04 15:52:55');
      const lastReset = userData.lastCreditReset ? new Date(userData.lastCreditReset) : null;
      
      const isNewMonth = !lastReset || (
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
      );

      if (isNewMonth) {
        const isSubscribed = Boolean(userData.subscription);
        const creditsAmount = isSubscribed ? 100 : 30;

        // Update credits
        await db
          .update(Users)
          .set({
            credits: creditsAmount,
            lastCreditReset: now,
            updatedAt: now
          })
          .where(eq(Users.email, user.primaryEmailAddress.emailAddress));

        // Update local state with new credit amount
        setUserDetail(prev => ({
          ...prev,
          credits: creditsAmount,
          lastCreditReset: now
        }));

        // Show notification
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-medium">Monthly Credits Refreshed! 🎉</span>
            <div className="text-sm space-y-1">
              <p>Your credits have been reset to {creditsAmount}</p>
              <p className="text-xs opacity-75">
                Plan: {isSubscribed ? 'Premium' : 'Free'}
              </p>
              <p className="text-xs opacity-75">
                Reset Time: {now.toLocaleString('en-US', { 
                  timeZone: 'UTC',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })} UTC
              </p>
            </div>
          </div>,
          { duration: 8000, position: "top-center" }
        );
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      toast.error('Failed to load user data. Please refresh the page.');
    } finally {
      setIsDataLoaded(true);
    }
  };

  // Effect to initialize data when user is loaded
  useEffect(() => {
    if (isUserLoaded && user) {
      initializeUserData();
    } else if (isUserLoaded && !user) {
      setIsDataLoaded(true); // No user, so we're done loading
    }
  }, [isUserLoaded, user]);

  // Show loading state while waiting for user data
  if (!isUserLoaded || !isDataLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <NavSkeleton />
        <div className="flex">
          <div className="hidden md:block">
            <SideNavSkeleton />
          </div>
          <main className="flex-1 p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-primary/10 rounded w-1/4"></div>
              <div className="h-32 bg-primary/10 rounded"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

// Render the layout once everything is loaded
return (
  <UserDetailContext.Provider value={{ userDetail, setUserDetail, isDataLoaded }}>
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      <div className="min-h-screen bg-background">
        <div className="hidden md:block h-screen fixed mt-14 border-r border-border/40 bg-background/60 dark:bg-transparent backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-background/0">
          <SideNav />
        </div>
        <div>
          <Header />
        </div>
        <main className="md:ml-64 pt-14 p-10">
          {children}
        </main>
      </div>
    </VideoDataContext.Provider>
  </UserDetailContext.Provider>
);
}

export default DashboardLayout;
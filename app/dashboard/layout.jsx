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

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    // Check if it's the first day of the month
    const now = new Date();
    const isFirstOfMonth = now.getDate() === 1;
    
    if (isFirstOfMonth && user) {
      const checkAndNotifyCredits = async () => {
        try {
          const result = await db
            .select()
            .from(Users)
            .where(eq(Users.email, user.primaryEmailAddress?.emailAddress));

          const userData = result[0];
          
          if (userData) {
            const creditsAmount = userData.subscription === true ? 100 : 30;
            
            toast.success(
              <div className="flex flex-col gap-1">
                <span className="font-medium">Monthly Credits Refreshed! 🎉</span>
                <div className="text-sm space-y-1">
                  <p>Your credits have been reset to {creditsAmount}</p>
                  <p className="text-xs opacity-75">
                    Plan: {userData.subscription === true ? 'Premium' : 'Free'}
                  </p>
                  <p className="text-xs opacity-75">
                    Reset Time: {new Date().toLocaleString('en-US', { 
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
              {
                duration: 8000,
                position: "top-center",
              }
            );

            // Update the user's credits in the database
            await db
              .update(Users)
              .set({
                credits: creditsAmount,
                updatedAt: new Date()
              })
              .where(eq(Users.email, user.primaryEmailAddress?.emailAddress));

            // Refresh user details after update
            getUserDetail();
          }
        } catch (error) {
          console.error('Error checking/updating credits:', error);
          toast.error('Failed to refresh credits');
        }
      };

      checkAndNotifyCredits();
    }
  }, [user]);

  useEffect(() => {
    user && getUserDetail();
  }, [user]);

  const getUserDetail = async () => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
      
      if (result[0]) {
        setUserDetail(result[0]);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
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
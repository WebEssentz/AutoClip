'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/dashboard/_components/Header';
import SideNav from '@/app/dashboard/_components/SideNav';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import { Users } from '@/src/db/schema';
import { db } from '@/src/db';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { NavSkeleton, SideNavSkeleton } from '@/components/LoadingSkeleton';

// Define proper types
type UserDetail = typeof Users.$inferSelect;

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const [videoData, setVideoData] = useState<any[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize user data
  const initializeUserData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const email = user.primaryEmailAddress.emailAddress;
      
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, email));

      if (result && result[0]) {
        setUserDetail(result[0]);
      } else {
        console.warn('No user details found for email:', email);
        toast.error('User details not found');
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
          <main className="flex-1 md:ml-64 pt-20 p-10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-primary/10 rounded w-1/4"></div>
                <div className="h-32 bg-primary/10 rounded"></div>
                <div className="h-32 bg-primary/10 rounded"></div>
              </div>
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
          <main className="md:ml-64 pt-20 p-10">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}
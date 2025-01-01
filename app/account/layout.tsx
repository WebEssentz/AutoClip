// app/account/layout.tsx
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

// Define proper types
type UserDetail = typeof Users.$inferSelect;

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const [videoData, setVideoData] = useState<any[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getUserDetail();
    }
  }, [user]);

  const getUserDetail = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      
      if (!email) {
        toast.error('No email address found');
        return;
      }

      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, email));

      if (result && result[0]) {
        setUserDetail(result[0]);
      } else {
        console.warn('No user details found for email:', email);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
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
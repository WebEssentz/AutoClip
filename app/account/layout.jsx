// app/account/layout.jsx
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

export default function AccountLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getUserDetail();
  }, [user]);

  const getUserDetail = async () => {
    const result = await db.select().from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
    setUserDetail(result[0]);
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
          <main className="md:ml-64 pt-20 p-10"> {/* Changed pt-14 to pt-20 for more top padding */}
            <div className="max-w-7xl mx-auto space-y-6"> {/* Added space-y-6 for better content spacing */}
              <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
              {children}
            </div>
          </main>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}
"use client"
import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from '../_context/VideoDataContext';
import { UserDetailContext } from '../_context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import { Users } from '@/src/db/schema';
import { db } from '@/src/db';
import { eq } from 'drizzle-orm';


function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const {user} = useUser()

  useEffect(() => {
    user && getUserDetail();
  }, [user])
  const getUserDetail = async () => {
    const result = await db.select().from(Users)
    .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress))
    setUserDetail(result[0]);
  }
  
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
  )
}

export default DashboardLayout
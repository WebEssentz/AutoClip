// app/upgrade/layout.tsx
'use client';

import React from 'react';
import Header from '@/app/dashboard/_components/Header';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import { Users } from '@/src/db/schema';
import { db } from '@/src/db';
import { eq } from 'drizzle-orm';

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  const [userDetail, setUserDetail] = React.useState<any>([]);
  const { user } = useUser();

  React.useEffect(() => {
    user && getUserDetail();
  }, [user]);

  const getUserDetail = async () => {
    const result = await db.select().from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
    setUserDetail(result[0]);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 p-4 md:p-10">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </UserDetailContext.Provider>
  );
}
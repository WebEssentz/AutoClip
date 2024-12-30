// app/providers.tsx
'use client'

import { db } from '@/src/db';
import { Users } from '@/src/db/schema';
import { useUser } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';

export default function Provider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const checkAndCreateUser = async () => {
      // Wait for user to load and verify email exists
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const email = user.primaryEmailAddress.emailAddress;
        
        // Check if user exists
        const existingUsers = await db.select()
          .from(Users)
          .where(eq(Users.email, email));

        // If user doesn't exist, create new user
        if (existingUsers.length === 0 && user.fullName) {
          await db.insert(Users).values({
            name: user.fullName,
            email: email,
            imageUrl: user.imageUrl ?? null,
            subscription: false,
          });
          console.log('New user created:', email);
        }
      } catch (error) {
        console.error('Error managing user:', error);
      }
    };

    checkAndCreateUser();
  }, [user, isLoaded]);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
// app/sign-out-callback/page.tsx
'use client'

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut();
      router.push('/sign-in');
    };

    handleSignOut();
  }, [signOut, router]);

  return null;
}
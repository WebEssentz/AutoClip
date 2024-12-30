// app/sso-callback/page.tsx
'use client'

import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const router = useRouter();

  return (
    <AuthenticateWithRedirectCallback
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    />
  );
}
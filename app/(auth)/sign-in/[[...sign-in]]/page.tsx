// app/sign-in/[[...sign-in]]/page.tsx
'use client'

import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaDiscord } from "react-icons/fa";
import Link from "next/link";
import { AuthContainer, OAuthButton } from "@/components/auth/shared";

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();

  const signInWith = (strategy: OAuthStrategy) => {
    if (!isLoaded) return;
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard", // Changed from "/" to "/dashboard"
    });
  };

  return (
    <AuthContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header with enhanced animation */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-white">
              Welcome Back
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-600 dark:text-zinc-400"
          >
            Sign in to continue to your account
          </motion.p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-4">
          {[
            { icon: <FcGoogle className="w-5 h-5" />, label: "Continue with Google", strategy: "oauth_google" },
            { icon: <FaApple className="w-5 h-5" />, label: "Continue with Apple", strategy: "oauth_apple" },
            { icon: <FaDiscord className="w-5 h-5 text-[#5865F2]" />, label: "Continue with Discord", strategy: "oauth_discord" }
          ].map((provider, index) => (
            <motion.div
              key={provider.strategy}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <OAuthButton
                icon={provider.icon}
                label={provider.label}
                onClick={() => signInWith(provider.strategy as OAuthStrategy)}
              />
            </motion.div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-zinc-600 dark:text-zinc-400"
        >
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </AuthContainer>
  );
}
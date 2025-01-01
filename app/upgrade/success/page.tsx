// app/upgrade/success/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 mt-[23px]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <Check className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Premium! 🎉
          </h1>
          <p className="text-muted-foreground text-lg">
            Your account has been successfully upgraded
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card p-6 rounded-xl border border-border/50 space-y-4"
        >
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Premium Benefits Activated:</span>
          </div>
          <ul className="space-y-3 text-left">
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>100 Monthly Credits Added</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Priority Support Enabled</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Early Access Features Unlocked</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <p className="text-sm text-muted-foreground">
            Check your email for your receipt and subscription details
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
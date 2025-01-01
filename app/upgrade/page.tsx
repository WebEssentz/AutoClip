'use client';

import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { toast, Toaster } from 'sonner';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { Check, ArrowRight, ArrowLeft, Sparkles, Shield, Zap, Crown, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

// Type definitions for better type safety
interface FeatureProps {
  text: string;
  icon: React.ReactNode;
  delay?: number;
}

interface PricingCardProps {
  isSubscribed: boolean;
  onUpgrade: () => Promise<void>;
}

// Reusable styled components
const BackButton = () => (
  <Link 
    href="/dashboard" 
    className="group fixed top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 ease-out mt-[100px]"
  >
    <motion.div
      initial={{ x: 0 }}
      whileHover={{ x: -4 }}
      className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg"
    >
      <ArrowLeft className="w-4 h-4" />
    </motion.div>
    <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Back to Dashboard
    </span>
  </Link>
);

const Feature: React.FC<FeatureProps> = ({ text, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
  >
    <div className="flex-shrink-0 p-2 rounded-md bg-primary/10 text-primary">
      {icon}
    </div>
    <span className="text-sm font-medium">{text}</span>
  </motion.div>
);

const PricingCard: React.FC<PricingCardProps> = ({ isSubscribed, onUpgrade }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className={cn(
      "relative overflow-hidden rounded-2xl border border-border/50",
      "bg-gradient-to-b from-background via-background/80 to-background/90",
      "backdrop-blur-xl shadow-2xl",
      "p-8 md:p-10"
    )}
  >
    {/* Premium badge */}
    <div className="absolute -top-4 -right-4 p-6 bg-primary/10 blur-2xl rounded-full" />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-3 right-3"
    >
      <Crown className="w-6 h-6 text-primary" />
    </motion.div>

    {/* Content */}
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">
          Premium Plan
          <span className="ml-2 inline-block animate-pulse">✨</span>
        </h2>
        <p className="text-muted-foreground">Unlock your creative potential</p>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold">$30</span>
        <span className="text-muted-foreground">/month</span>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4 border-t border-border/50">
        <Feature icon={<Sparkles className="w-4 h-4" />} text="100 Credits Monthly" delay={0.1} />
        <Feature icon={<Shield className="w-4 h-4" />} text="Premium Support" delay={0.2} />
        <Feature icon={<Zap className="w-4 h-4" />} text="Early Access to Features" delay={0.3} />
        <Feature icon={<Star className="w-4 h-4" />} text="Priority Processing" delay={0.4} />
        <Feature icon={<Check className="w-4 h-4" />} text="No Watermark" delay={0.5} />
      </div>

      {/* Action Button */}
      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.button
            key="upgrade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={onUpgrade}
            className={cn(
              "w-full group relative",
              "px-6 py-3 rounded-xl",
              "bg-gradient-to-r from-primary to-primary/80",
              "hover:opacity-90 transition-all duration-300",
              "font-medium text-primary-foreground",
              "flex items-center justify-center gap-2",
              "shadow-lg shadow-primary/25",
              "overflow-hidden"
            )}
          >
            <span className="relative z-10">Upgrade Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/25 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </motion.button>
        ) : (
          <motion.div
            key="subscribed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "relative overflow-hidden",
              "bg-primary/10 text-primary",
              "rounded-xl p-4",
              "flex flex-col items-center gap-2"
            )}
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">You're on Premium</span>
            <div className="text-xs text-primary/80">Enjoy all premium features</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

export default function UpgradePage() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);

  const handleUpgradeClick = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        toast.error('Please sign in to continue');
        return;
      }

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName,
        }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment');
    }
  };

  return (
    <>
      <Toaster />
      <BackButton />
      <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-20">
        <PricingCard 
          isSubscribed={Boolean(userDetail?.subscription)} 
          onUpgrade={handleUpgradeClick}
        />
      </div>
    </>
  );
}
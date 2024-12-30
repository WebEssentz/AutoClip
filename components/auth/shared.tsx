// components/auth/shared.tsx
'use client'

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { BrandLogo } from "./logo";
import Link from "next/link";

export const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
      {/* Improved light mode background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-zinc-50/50 to-zinc-100/90 dark:from-zinc-900 dark:to-zinc-800 -z-10" />
      
      {/* Refined accent blurs */}
      <div className="fixed top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl -z-10 animate-pulse duration-[5000ms]"
        style={{
          background: theme === 'dark' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(99, 102, 241, 0.07)'
        }}
      />
      <div className="fixed bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl -z-10 animate-pulse duration-[5000ms]"
        style={{
          background: theme === 'dark'
            ? 'rgba(147, 51, 234, 0.2)'
            : 'rgba(168, 85, 247, 0.07)'
        }}
      />
      
      {/* Light mode texture */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-0 pointer-events-none -z-10 bg-[url('/noise.png')]" />
      
      {/* Brand Logo */}
      <Link href="/">
       <BrandLogo />
      </Link>
      
      {/* Main Content */}
      <div className="w-full sm:w-[440px] px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
};

export const OAuthButton = ({ 
  icon, 
  label, 
  onClick, 
  className = "" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  className?: string;
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(`
        relative w-full flex items-center justify-center gap-3 
        px-6 py-4 rounded-xl 
        font-medium text-sm
        transition-all duration-200
        border border-black/[0.05] dark:border-zinc-700/50
        bg-white/90 dark:bg-zinc-800/50
        hover:bg-white dark:hover:bg-zinc-800
        hover:border-black/[0.08] dark:hover:border-zinc-700
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]
        dark:hover:shadow-none
        backdrop-blur-sm
        overflow-hidden
        group
      `, className)}
    >
      {/* Enhanced shimmer effect */}
      <motion.div
        className="absolute inset-0 w-[200%] -z-10"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(202, 200, 200, 0.8), transparent)',
        }}
        animate={{
          transform: ['translateX(-100%)', 'translateX(100%)'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
      
      {/* Icon with hover effect */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
        className="transition-transform"
      >
        {icon}
      </motion.div>
      
      <span className="text-zinc-800 dark:text-zinc-300">
        {label}
      </span>
    </motion.button>
  );
};
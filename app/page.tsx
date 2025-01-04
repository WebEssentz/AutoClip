"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { BrandLogo } from '@/components/auth/logo';
import {
  FaGithub,
  FaTwitter,
  FaDiscord
} from "react-icons/fa";
import {
  HiLockClosed,
  HiDocumentText
} from "react-icons/hi";

// First, add the description data
const descriptions = [
  "Transform your content into engaging short-form videos with AI",
  "Create viral-worthy clips in seconds",
  "AI-powered editing that understands your content",
  "Turn long videos into shareable moments"
];

// Enhanced Shimmer Effect Component
const GlobalShimmer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className="fixed inset-0 w-[200%] pointer-events-none z-10"
      style={{
        background: isDark
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(255,255,255,0.05), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)',
      }}
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "linear"
      }}
    />
  );
};

// Sliding Description Component
const SlidingDescription = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % descriptions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-20 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          className="text-xl text-zinc-600 dark:text-zinc-400 absolute w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {descriptions[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// Updated Splash Screen with fixed dark mode
const SplashScreen = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-3xl
        ${isDark
          ? 'bg-zinc-900'
          : 'bg-white'
        }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <motion.div className="relative w-32 h-32">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute inset-0 rounded-2xl ${isDark
                  ? 'bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-cyan-500/30'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                }`}
              initial={{ rotate: 0, scale: 1 }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                borderRadius: ["16%", "50%", "16%"]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ opacity: isDark ? 0.1 + (i * 0.15) : 0.2 + (i * 0.2) }}
            />
          ))}
        </motion.div>
        <motion.h1
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-8 text-3xl font-bold
            ${isDark ? 'text-white' : 'text-black'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          AutoClip
        </motion.h1>
      </div>
    </motion.div>
  );
};

// Updated Premium Footer Component
const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="fixed bottom-0 left-0 right-0 p-8 backdrop-blur-xl bg-white/5 dark:bg-black/5 border-t border-zinc-200/10 dark:border-zinc-800/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start space-x-6">
            {/* Multiple GitHub accounts with tooltips */}
            <motion.div className="relative group">
              <motion.a
                href="https://github.com/king-lio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="w-6 h-6" />
              </motion.a>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block">
                <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap">
                  @king-lio
                </div>
              </div>
            </motion.div>
            <motion.a
              href="https://twitter.com/onyerikam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTwitter className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://discord.gg/autoclip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDiscord className="w-6 h-6" />
            </motion.a>
          </div>

          {/* Copyright with personal branding */}
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-medium"
            >
              © {new Date().getFullYear()} AutoClip, Inc.
              <span className="mx-2">|</span>
              <span className="group relative inline-block">
                Crafted by{" "}
                <a
                  href="https://github.com/onyerikam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block group-hover:translate-y-2 transition-transform duration-200"
                >
                  {/* Role - appears on hover */}
                  <motion.span
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs
            opacity-0 group-hover:opacity-100 transition-all duration-200
            text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  >
                    Full Stack Engineer
                  </motion.span>

                  {/* Name */}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r 
          from-blue-500 via-purple-500 to-pink-500 
          hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 
          transition-all duration-300"
                  >
                    Onyerikam
                  </span>
                </a>
              </span>
            </motion.p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center md:justify-end space-x-6">
            <motion.a
              href="/privacy"
              className="group flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiLockClosed className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Privacy</span>
            </motion.a>
            <motion.a
              href="/terms"
              className="group flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiDocumentText className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Terms</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';


  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="main"
          className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Updated background with more visible light mode */}
          <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/90 dark:from-zinc-900 dark:to-zinc-800 -z-10" />

          {/* Refined accent blurs - Exact copy from AuthContainer */}
          <div
            className="fixed top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl -z-10 animate-pulse duration-[5000ms]"
            style={{
              background: theme === 'dark'
                ? 'rgba(59, 130, 246, 0.2)'
                : 'rgba(99, 102, 241, 0.15)' // Increased opacity for light mode
            }}
          />
          <div
            className="fixed bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl -z-10 animate-pulse duration-[5000ms]"
            style={{
              background: theme === 'dark'
                ? 'rgba(147, 51, 234, 0.2)'
                : 'rgba(168, 85, 247, 0.15)' // Increased opacity for light mode
            }}
          />

          {/* Light mode texture */}
          <div className="fixed inset-0 opacity-[0.02] dark:opacity-0 pointer-events-none -z-10 bg-[url('/noise.png')]" />

          {/* Global shimmer effect */}
          <GlobalShimmer />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-5xl mx-auto">
            {/* Company Logo */}
            <div className="absolute top-8 left-8">
              <BrandLogo />
            </div>

            {/* Main Content */}
            <main className="flex items-center justify-center min-h-screen">
              <div className="max-w-3xl mx-auto text-center">
                {/* Logo + App Name */}
                <motion.div
                  className="flex items-center justify-center gap-4 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {/* App Logo */}
                  <motion.div
                    className="w-16 h-16"
                    whileHover={{ scale: 1.05 }}
                  >
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full text-zinc-900 dark:text-white"
                    >
                      <motion.path
                        d="M20 4L36 32H4L20 4Z"
                        fill="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5 }}
                      />
                    </svg>
                  </motion.div>

                  {/* App Name */}
                  <motion.h1
                    className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    AutoClip
                  </motion.h1>
                </motion.div>

                {/* Sliding Description */}
                <SlidingDescription />

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12"
                >
                  <Link href="/sign-up">
                    <motion.button
                      className="relative overflow-hidden px-8 py-4 rounded-xl text-lg font-medium
              bg-zinc-900 dark:bg-white/90
              text-white dark:text-zinc-900
              hover:bg-zinc-800 dark:hover:bg-white
              border border-black/[0.05] dark:border-white/[0.05]
              hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]
              backdrop-blur-sm
              transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Footer */}
                <Footer />
              </div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
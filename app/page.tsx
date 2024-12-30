"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});


// Modern Splash Screen Component
const SplashScreen = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <div className="relative">
        {/* Processing Rings */}
        <motion.div
          className={`absolute -inset-8 rounded-full border ${
            isDark ? 'border-white/20' : 'border-black/20'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -inset-16 rounded-full border ${
            isDark ? 'border-white/20' : 'border-black/20'
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Frame */}
        <motion.div
          className={`w-72 h-40 border-2 rounded-lg overflow-hidden backdrop-blur-sm ${
            isDark 
              ? 'border-white/50 bg-white/5' 
              : 'border-black/50 bg-black/5'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotateY: [0, 360],
          }}
          transition={{
            duration: 3.5,
            ease: "easeInOut",
          }}
        >
          {/* Content Lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 mx-4 rounded-full ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ 
                x: "200%",
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
              style={{ 
                marginTop: `${i * 8 + 8}px`,
                width: `${Math.random() * 30 + 70}%` 
              }}
            />
          ))}
        </motion.div>

        {/* Brand Text */}
        <motion.div
          className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2 }}
        >
          <h1 className={`text-4xl font-bold mb-3 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            AutoClip
          </h1>
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.p
              className={`text-sm ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              AI-Powered Video Magic
            </motion.p>
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              animate={{ scale: [1.5, 1, 1.5], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Date and Time */}
      <motion.div
        className={`absolute top-4 right-4 text-sm ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <time dateTime={new Date().toISOString()}>
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}
        </time>
      </motion.div>

      {/* User Login */}
      <motion.div
        className={`absolute top-4 left-4 text-sm ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        WebEssentz
      </motion.div>
    </motion.div>
  );
};

// High-Converting Hero Section// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <motion.nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 
        ${isScrolled 
          ? 'py-4 backdrop-blur-lg bg-white/10 dark:bg-black/10' 
          : 'py-6'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <motion.a
            href="/"
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-black'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            AutoClip
          </motion.a>

          <div className="flex items-center gap-8">
            <NavLinks />
            <Link href={"/sign-up"}>           
              <motion.button
                className={`px-4 py-2 rounded-full font-medium hidden md:block
                  ${isDark 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-black text-white hover:bg-black/90'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Navigation Links
const NavLinks = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <div className="hidden md:flex items-center gap-8">
      {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
        <motion.a
          key={item}
          href={`#${item.toLowerCase()}`}
          className={`text-sm font-medium transition-colors
            ${isDark 
              ? 'text-white/70 hover:text-white' 
              : 'text-black/70 hover:text-black'
            }`}
          whileHover={{ y: -2 }}
        >
          {item}
        </motion.a>
      ))}
    </div>
  );
};

const Hero = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Stats for social proof
  const stats = [
    { number: "50K+", label: "Videos Created" },
    { label: "⭐️ 4.9/5", sublabel: "User Rating" },
    { number: "2M+", label: "Users" }
  ];

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      {/* Circuit Board Animation Effect */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.03]">
          <pattern
            id="circuit"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 25 0 L 25 50 M 0 25 L 50 25"
              className={isDark ? 'stroke-white' : 'stroke-black'}
              strokeWidth="0.5"
            />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Animated Lines Converging */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute h-0.5 w-1/3 ${
              isDark ? 'bg-white/20' : 'bg-black/20'
            }`}
            initial={{ 
              x: -100,
              y: 100 * (i + 1),
              opacity: 0 
            }}
            animate={{ 
              x: '100vw',
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left space-y-8">
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  isDark ? 'bg-white/10' : 'bg-black/10'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isDark ? 'bg-white' : 'bg-black'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isDark ? 'bg-white' : 'bg-black'
                  }`}></span>
                </span>
                <span className="text-sm font-medium">AI-Powered Video Creation</span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className={`text-5xl md:text-6xl font-bold leading-tight`}>
                  Create Videos{' '}
                  <span className="relative">
                    Instantly
                    <motion.div
                      className={`absolute -z-10 inset-0 ${
                        isDark ? 'bg-white/10' : 'bg-black/10'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    />
                  </span>
                  {' '}with AI
                </h1>
                <p className="text-xl opacity-70">
                  Transform your ideas into professional videos in minutes. 
                  No editing skills required.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  className={`px-8 py-4 rounded-lg font-medium ${
                    isDark 
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'bg-black text-white hover:bg-black/90'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Creating Free
                </motion.button>
                <motion.button
                  className={`px-8 py-4 rounded-lg font-medium ${
                    isDark 
                      ? 'border border-white/20 hover:bg-white/10' 
                      : 'border border-black/20 hover:bg-black/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-8 pt-8 border-t border-current/10"
              >
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-2xl font-bold">{stat.number || stat.label}</div>
                    {stat.number && (
                      <div className="text-sm opacity-60">{stat.label}</div>
                    )}
                    {stat.sublabel && (
                      <div className="text-sm opacity-60">{stat.sublabel}</div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Video Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className={`aspect-video rounded-lg overflow-hidden border-2 ${
                isDark ? 'border-white/20' : 'border-black/20'
              }`}>
                {/* Placeholder for video preview */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
                
                {/* Play Button */}
                <motion.button
                  className={`absolute inset-0 flex items-center justify-center ${
                    isDark ? 'bg-black/50' : 'bg-white/50'
                  } hover:bg-transparent transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className={`w-16 h-16 ${
                      isDark ? 'text-white' : 'text-black'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>

                {/* Video Timeline Animation */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 ${
                    isDark ? 'bg-white/20' : 'bg-black/20'
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>

              {/* Feature Highlights */}
              <div className="absolute -right-4 top-4 space-y-4">
                {[
                  "AI-Powered Editing",
                  "Professional Templates",
                  "One-Click Export"
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (i * 0.2) }}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      isDark 
                        ? 'bg-white/10 backdrop-blur-sm' 
                        : 'bg-black/10 backdrop-blur-sm'
                    }`}
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>

              {/* Processing Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm ${
                  isDark ? 'bg-white/10' : 'bg-black/10'
                } backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-white' : 'bg-black'
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span>AI Processing Video...</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Trusted By Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-20 text-center"
          >
            <p className="text-sm uppercase tracking-wider opacity-50 mb-8">
              Trusted by creators worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-8 w-24 rounded ${
                    isDark ? 'bg-white/10' : 'bg-black/10'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main Content Component
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`${inter.className} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main"
            className="min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Navigation />
            <Hero />
            {/* Add more sections here */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
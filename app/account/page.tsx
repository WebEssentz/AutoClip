// app/account/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { toast, Toaster } from 'sonner';
import { db } from '@/src/db';
import { Users, VideoData, VideoExports } from '@/src/db/schema';
import { useContext } from 'react';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { eq } from 'drizzle-orm';
import Header from '@/app/dashboard/_components/Header';
import { 
  Shield, 
  CircuitBoard, 
  Wallet2, 
  Video,
  Coins,
  Bell,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  BadgeCheck
} from 'lucide-react';

interface UserStats {
  totalVideos: number;
  activeVideos: number;
  creditsRemaining: number;
  videosAvailable: number;
  totalExports: number;
}

interface ToastSettings {
  position: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  theme: 'light' | 'dark' | 'system';
  duration: number;
  richColors: boolean;
}

export default function AccountPage() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const { videoData } = useContext(VideoDataContext);
  
  const [stats, setStats] = useState<UserStats>({
    totalVideos: 0,
    activeVideos: 0,
    creditsRemaining: 0,
    videosAvailable: 0,
    totalExports: 0
  });

  const [toastSettings, setToastSettings] = useState<ToastSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toast_settings');
      return saved ? JSON.parse(saved) : {
        position: 'top-right',
        theme: 'system',
        duration: 4000,
        richColors: true
      };
    }
    return {
      position: 'top-right',
      theme: 'system',
      duration: 4000,
      richColors: true
    };
  });

  // Remove getUserDetail since it's handled by context
  useEffect(() => {
    calculateStats();
  }, [userDetail, videoData]); // Update dependencies

  const calculateStats = async () => {
    try {
      if (!user?.id) return;

      const videos = await db.select().from(VideoData)
        .where(eq(VideoData.createdBy, user?.primaryEmailAddress?.emailAddress));

      const exports = await db.select().from(VideoExports)
        .where(eq(VideoExports.userId, user.id));

      const activeVideos = videoData.filter(v => v.exportCount > 0);
      const userCredits = userDetail?.credits || 0;
      const possibleVideos = Math.floor(userCredits / 10);

      setStats({
        totalVideos: videos.length,
        activeVideos: activeVideos.length,
        creditsRemaining: userCredits,
        videosAvailable: possibleVideos,
        totalExports: exports.length
      });
    } catch (error) {
      toast.error('Failed to load account statistics');
    }
  };


  const calculateNextResetDate = (lastResetDate: string | null): string => {
    if (!lastResetDate) return 'Not available';
    const nextReset = new Date(lastResetDate);
    nextReset.setMonth(nextReset.getMonth() + 1);
    return nextReset.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const saveToastSettings = (newSettings: Partial<ToastSettings>) => {
    setToastSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('toast_settings', JSON.stringify(updated));
      toast.success('Notification settings updated');
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full p-4 md:p-8">
        <Toaster {...toastSettings} />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full space-y-8"
        >
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 md:p-8 border border-primary/10"
          >
            <div className="absolute top-4 right-4 flex flex-col items-end text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-4 h-4" />
                <span>Login: {userDetail?.name}</span>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back, {userDetail?.name}
                </h1>
                <p className="text-muted-foreground">
                  Member since {new Date(userDetail?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="rounded-full overflow-hidden border-4 border-background shrink-0"
              >
                <img 
                  src={userDetail?.imageUrl || user?.imageUrl} 
                  alt="Profile"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full"
                />
              </motion.div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              <StatCard
                icon={<Video className="w-5 h-5" />}
                label="Total Videos"
                value={stats.totalVideos}
              />
              <StatCard
                icon={<CircuitBoard className="w-5 h-5" />}
                label="Active Videos"
                value={stats.activeVideos}
              />
              <StatCard
                icon={<Coins className="w-5 h-5" />}
                label="Credits"
                value={stats.creditsRemaining}
              />
              <StatCard
                icon={<Download className="w-5 h-5" />}
                label="Total Exports"
                value={stats.totalExports}
              />
              <StatCard
                icon={<Calendar className="w-5 h-5" />}
                label="Next Reset"
                value={calculateNextResetDate(userDetail?.lastCreditReset)}
              />
            </div>
          </motion.div>

          {/* Settings Grid - Now full width */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Details Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Account Details</h3>
              </div>
              <div className="space-y-4">
                <InfoRow label="Email" value={user?.primaryEmailAddress?.emailAddress || ''} />
                <InfoRow 
                  label="Auth Provider" 
                  value={user?.primaryEmailAddress?.verification?.strategy || 'Email'}
                  badge={true}
                />
                <InfoRow 
                  label="Subscription" 
                  value={userDetail?.subscription ? 'Premium' : 'Free'} 
                  badge={userDetail?.subscription}
                />
              </div>
            </motion.div>

            {/* Usage & Limits Card with updated calculations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Wallet2 className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Usage & Limits</h3>
              </div>
              <div className="space-y-4">
                <InfoRow 
                  label="Videos Available" 
                  value={`${stats.videosAvailable} videos`}
                  subtitle={`(${stats.creditsRemaining} credits = ${stats.videosAvailable} videos)`}
                />
                <InfoRow 
                  label="Credits per Video" 
                  value="10 credits"
                />
                <InfoRow 
                  label="Monthly Reset" 
                  value={userDetail?.subscription ? '100 credits' : '30 credits'}
                />
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground">Credit Usage</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ 
                        width: `${(stats.creditsRemaining / (userDetail?.subscription ? 100 : 30)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* New Notification Settings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Notification Settings</h3>
              </div>
              <div className="space-y-4">
                <InfoRow 
                  label="Position"
                  value={
                    <select
                      value={toastSettings.position}
                      onChange={(e) => saveToastSettings({ position: e.target.value as any })}
                      className="w-full p-2 rounded-md border border-border bg-background"
                    >
                      {['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left']
                        .map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))
                      }
                    </select>
                  }
                />

                <InfoRow 
                  label="Theme"
                  value={
                    <select
                      value={toastSettings.theme}
                      onChange={(e) => saveToastSettings({ theme: e.target.value as any })}
                      className="w-full p-2 rounded-md border border-border bg-background"
                    >
                      {['light', 'dark', 'system'].map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  }
                />

                <InfoRow 
                  label="Duration"
                  value={
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={toastSettings.duration / 1000}
                      onChange={(e) => saveToastSettings({ duration: Number(e.target.value) * 1000 })}
                      className="w-full"
                    />
                  }
                  subtitle={`${toastSettings.duration / 1000}s`}
                />

                <InfoRow 
                  label="Rich Colors"
                  value={
                    <button
                      onClick={() => saveToastSettings({ richColors: !toastSettings.richColors })}
                      className={`p-2 rounded-md ${
                        toastSettings.richColors ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  }
                />

                <button
                  onClick={() => toast.message('This is a test notification')}
                  className="w-full mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Test Notification
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Previous StatCard and InfoRow components remain the same
const StatCard = ({ icon, label, value }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-card p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors"
  >
    <div className="flex items-center space-x-2 text-muted-foreground">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="mt-2">
      <span className="text-2xl font-bold">{value}</span>
    </div>
  </motion.div>
);

const InfoRow = ({ label, value, subtitle, badge }) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="text-sm text-muted-foreground">{label}</span>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{value}</span>
      {badge !== undefined && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          badge ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          {badge ? 'Active' : 'Inactive'}
        </span>
      )}
    </div>
  </div>
);
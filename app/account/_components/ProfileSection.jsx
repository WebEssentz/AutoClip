// app/account/_components/ProfileSection.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db } from '@/src/db';
import { Users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { 
  FaGoogle, 
  FaApple, 
  FaDiscord,
  FaCheck,
  FaPencilAlt
} from 'react-icons/fa';
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSection() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const result = await db
          .select()
          .from(Users)
          .where(eq(Users.email, user.primaryEmailAddress.emailAddress));
        
        if (result?.[0]) {
          setUserDetails(result[0]);
          setDisplayName(result[0].name);
        }
      }
    };

    if (user) fetchUserDetails();
  }, [user]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const handleUpdateName = async () => {
    if (!displayName.trim()) return;
    
    setIsSaving(true);
    try {
      // Update name in Clerk with correct parameter names (camelCase)
      await user.update({
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' ')
      });
  
      // Update name in your database
      await db
        .update(Users)
        .set({ name: displayName })
        .where(eq(Users.email, user.primaryEmailAddress.emailAddress));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getAuthMethodIcon = (method) => {
    switch (method) {
      case 'oauth_google':
        return <FaGoogle className="text-[#4285F4]" />;
      case 'oauth_apple':
        return <FaApple className="text-[#000000] dark:text-white" />;
      case 'oauth_discord':
        return <FaDiscord className="text-[#5865F2]" />;
      default:
        return null;
    }
  };

  const getAuthMethods = () => {
    return user?.externalAccounts?.map(account => account.provider) || [];
  };

  if (!isLoaded || !mounted) {
    return <ProfileSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden backdrop-blur-xl bg-background/95 border-border/40 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-primary/5" />
        
        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="w-24 h-24 rounded-2xl border-4 border-background shadow-xl">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="text-xl">
                  {displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2"
                    >
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="max-w-[250px] bg-background/50 border-border/50 focus-visible:ring-primary/30"
                        placeholder="Enter your name"
                      />
                      <Button 
                        onClick={handleUpdateName}
                        variant="default"
                        size="sm"
                        disabled={isSaving}
                        className="bg-primary/90 hover:bg-primary"
                      >
                        {isSaving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full"
                          />
                        ) : (
                          <FaCheck className="mr-2 h-4 w-4" />
                        )}
                        Save
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4"
                    >
                      <h3 className="text-2xl font-bold">{displayName}</h3>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        <FaPencilAlt className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground font-medium">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>

                {mounted && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20">
                      {userDetails?.credits || 0} Credits
                    </Badge>
                    <span>•</span>
                    <span>Member since {formatDate(user?.createdAt)}</span>
                    <span>•</span>
                    <span>Last active {formatDate(user?.lastSignInAt)}</span>
                  </div>
                )}

                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getAuthMethods().map((method) => (
                    <Badge 
                      key={method}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full"
                    >
                      {getAuthMethodIcon(method)}
                      {method.replace('oauth_', '').charAt(0).toUpperCase() + 
                       method.replace('oauth_', '').slice(1)}
                    </Badge>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="backdrop-blur-sm bg-background/95 border-border/40">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start space-x-6">
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLoadingStore } from "@/src/store/loadingState";

export function CustomUserButton() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const startSignOut = useLoadingStore(state => state.startSignOut);

  useEffect(() => {
    if (isSigningOut) {
      setIsOpen(false);
    }
  }, [isSigningOut]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setFadeOut(true);

    // Trigger global loading state immediately
    startSignOut();

    // Prefetch sign-in page
    router.prefetch('/sign-in');

    try {
      // Show skeleton for a minimum time
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 500)),
        signOut()
      ]);

      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out failed:', error);
      setIsSigningOut(false);
      setFadeOut(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0.7 : 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <DropdownMenu open={isOpen && !isSigningOut} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative h-8 w-8 rounded-full overflow-hidden",
              isSigningOut && "cursor-not-allowed"
            )}
            disabled={isSigningOut}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isSigningOut ? 'signing-out' : 'normal'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isSigningOut ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : null}
                <Avatar className={cn(
                  "h-8 w-8 transition-opacity duration-200",
                  isSigningOut && "opacity-50"
                )}>
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || ""}
                    className={cn(
                      "transition-transform duration-200",
                      isSigningOut && "scale-95"
                    )}
                  />
                  <AvatarFallback className={cn(
                    "transition-opacity duration-200",
                    isSigningOut && "opacity-50"
                  )}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={cn(
            "w-56 transition-opacity duration-200",
            isSigningOut && "opacity-50 pointer-events-none"
          )}
          align="end"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push('/account')}
              disabled={isSigningOut}
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isSigningOut
                  ? "text-muted-foreground"
                  : "text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
              )}
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
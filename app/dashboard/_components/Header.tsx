'use client'

import { Button } from '@/components/ui/button'
import { CustomUserButton } from './CustomUserButton';
import { UserButton, useUser } from '@clerk/nextjs'
import { Menu, X, Command, CircleUser, FileVideo, ShieldPlus, LucideIcon, LayoutGrid} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { UserDetailContext } from '@/app/_context/UserDetailContext'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    router.push('/sign-out-callback');
  };

  interface MenuItem {
    id: number
    name: string
    path: string
    icon: LucideIcon
    badge?: string
  }

  const pathname = usePathname()
  
  const MenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      // Using Lucide's LayoutGrid instead of custom SVG
      icon: LayoutGrid
    },
    {
      id: 2,
      name: 'Create New',
      path: '/dashboard/create-new',
      icon: FileVideo,
      badge: 'New'
    },
    {
      id: 3,
      name: 'Upgrade',
      path: '/upgrade',
      icon: ShieldPlus,
      badge: 'Pro'
    },
    {
      id: 4,
      name: 'Account',
      path: '/account',
      icon: CircleUser
    }
  ]

  const currentTime = new Date().toLocaleString('en-US', { 
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-border/40 bg-background/60 dark:bg-transparent backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-background/0">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-colors hover:opacity-90"
          >
            <Command className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">
              AutoClip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Credits Display */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <span className="text-sm font-medium">Credits:</span>
              <span className="text-sm font-bold">{userDetail?.credits || 0}</span>
            </div>
            {/* <Button 
              variant="ghost" 
              className="text-sm font-medium"
              asChild
            >
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
            <div className="h-6 w-px bg-border/40 mx-2" /> */}
            <CustomUserButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
          <CustomUserButton />
            <Button
              variant="ghost"
              size="icon"
              className="relative z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 dark:bg-background/80"
          >
            <div className="px-4 py-4">
              <div className="flex flex-col gap-4">
                {/* Time and User */}
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || 'User'}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {currentTime} UTC
                    </time>
                  </div>
                  {/* Credits Display for Mobile */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <span className="text-sm font-medium">Credits:</span>
                    <span className="text-sm font-bold">{userDetail?.credits || 0}</span>
                  </div>
                </div>
                <nav className="justify-start px-2 font-medium">
                  {MenuItems.map((item) => {
                    const isActive = pathname === item.path
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                          isActive
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30
                            }}
                          />
                        )}
                        
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        
                        <span className="flex-1">{item.name}</span>
                        
                        {item.badge && (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                              item.badge === 'Pro'
                                ? "bg-primary/10 text-primary ring-primary/30"
                                : "bg-muted text-muted-foreground ring-border/50"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Header
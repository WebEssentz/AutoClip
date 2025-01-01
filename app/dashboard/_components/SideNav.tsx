'use client'

import { useContext } from 'react'
import { CircleUser, FileVideo, ShieldPlus, LucideIcon, LayoutGrid } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { UserDetailContext } from '@/app/_context/UserDetailContext'

interface MenuItem {
  id: number
  name: string
  path: string
  icon: LucideIcon
  badge?: string
  requiresUpgrade?: boolean
}

function SideNav() {
  const pathname = usePathname()
  const { userDetail } = useContext(UserDetailContext)
  const isSubscribed = Boolean(userDetail?.subscription)
  
  const MenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
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
      badge: 'Pro',
      requiresUpgrade: true
    },
    {
      id: 4,
      name: 'Account',
      path: '/account',
      icon: CircleUser
    }
  ]

  // Filter out upgrade menu item if user is subscribed
  const filteredMenuItems = MenuItems.filter(item => 
    !(item.requiresUpgrade && isSubscribed)
  )

  return (
    <div className="w-64 p-4">
      <nav className="space-y-1">
      <AnimatePresence mode="wait">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.path
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative",
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
              </motion.div>
            )
          })}
        </AnimatePresence>
      </nav>
      
      {/* Pro Features Preview - Only show for non-subscribers */}
      <AnimatePresence>
        {!isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-lg border border-border/50 p-4 shadow-sm hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
          >
            <Link href="/upgrade" className="group block">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                  <ShieldPlus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                    Upgrade to Pro
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Unlock all features & priority support
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SideNav
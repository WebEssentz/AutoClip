'use client'

import { CircleUser, FileVideo, ShieldPlus, LucideIcon, LayoutGrid } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface MenuItem {
  id: number
  name: string
  path: string
  icon: LucideIcon
  badge?: string
}

function SideNav() {
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

  return (
    <div className="w-64 p-4">
      <nav className="space-y-1">
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
      
      {/* Pro Features Preview */}
      <div className="mt-6 rounded-lg border border-border/50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <ShieldPlus className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Upgrade to Pro</h3>
            <p className="text-xs text-muted-foreground">
              Unlock all features & priority support
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNav
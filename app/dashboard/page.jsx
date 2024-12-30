"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import EmptyState from './_components/EmptyState'
import { Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/src/db'
import { VideoData } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import VideoList from './_components/VideoList'
import { motion, AnimatePresence } from 'framer-motion'

function Dashboard() {
  const [videoList, setVideoList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoaded: isUserLoaded } = useUser()

  useEffect(() => {
    if (isUserLoaded && user) {
      getVideoList()
    }
  }, [isUserLoaded, user])

  const getVideoList = async () => {
    try {
      const result = await db.select().from(VideoData)
        .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress))
      setVideoList(result)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Animate variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  }

  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <div className="px-4 sm:px-6 pt-safe-top pb-safe-bottom">
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8 sm:pt-12'>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='font-bold text-3xl sm:text-2xl text-primary text-center sm:text-left'
          >
            Dashboard
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/dashboard/create-new" className="block w-full sm:w-auto">   
              <Button className="w-full sm:w-auto justify-center group hover:scale-105 transition-transform">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> 
                Create New
              </Button>
            </Link>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px]"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading your videos...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:ml-0 sm:ml-0 mt-8 sm:mt-12 lg:ml-[-18px]"
            >
              {videoList.length === 0 ? (
                <EmptyState />
              ) : (
                <VideoList videoList={videoList} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Dashboard
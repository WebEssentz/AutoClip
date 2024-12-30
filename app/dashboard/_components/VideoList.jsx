import React, { useState, useEffect } from 'react'
import { Thumbnail } from "@remotion/player"
import RemotionVideo from './RemotionVideo'
import PlayerDialog from './PlayerDialog'
import { motion } from 'framer-motion'
import { Clock, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { storage } from '@/src/firebaseConfig' // Corrected import path
import { ref, deleteObject, listAll } from 'firebase/storage'
import { db } from '@/src/db'
import { VideoData } from '@/src/db/schema'
import { eq } from 'drizzle-orm'

function VideoList({ videoList: initialVideoList, setVideoList }) {
  const [openPlayDialog, setOpenPlayDialog] = useState(false)
  const [videoId, setVideoId] = useState()
  const [isDeletingMap, setIsDeletingMap] = useState({})
  const [localVideoList, setLocalVideoList] = useState(initialVideoList)

  // Add the missing animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  }

  const trashIconVariants = {
    initial: { rotate: 0 },
    hover: { 
      rotate: [0, -15, 15, -15, 15, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }

  const handleDeleteVideo = async (e, video) => {
    e.stopPropagation()
    
    if (isDeletingMap[video.id]) return

    // Optimistic UI update
    setLocalVideoList(prev => prev.filter(v => v.id !== video.id))
    
    // Show immediate feedback
    const toastId = toast.loading('Deleting video...')
    
    setIsDeletingMap(prev => ({ ...prev, [video.id]: true }))

    try {
      // 1. Delete Firebase Storage files
      const baseStoragePath = `ai-short-video-files/${video.id}`
      
      try {
        // Delete audio file
        if (video.audioFileUrl) {
          const audioRef = ref(storage, video.audioFileUrl)
          await deleteObject(audioRef)
          toast.loading('Deleting audio files...', { id: toastId })
        }

        // Delete images
        if (video.imageList && video.imageList.length > 0) {
          toast.loading('Deleting image files...', { id: toastId })
          await Promise.all(video.imageList.map(async (imageUrl) => {
            try {
              const imageRef = ref(storage, imageUrl)
              await deleteObject(imageRef)
            } catch (error) {
              if (error.code !== 'storage/object-not-found') {
                throw error
              }
            }
          }))
        }

        // Delete any remaining files in the video directory
        const videoFolderRef = ref(storage, baseStoragePath)
        const remainingFiles = await listAll(videoFolderRef)
        
        if (remainingFiles.items.length > 0) {
          toast.loading('Cleaning up additional files...', { id: toastId })
          await Promise.all(remainingFiles.items.map(item => deleteObject(item)))
        }

        toast.success('Files deleted from storage', { id: toastId })
      } catch (error) {
        console.error('Storage deletion error:', error)
        if (error.code === 'storage/object-not-found') {
          toast.warning('Some files were already removed', { id: toastId })
        } else {
          toast.error('Error deleting files from storage', { id: toastId })
        }
      }

      // 2. Delete from Database
      try {
        toast.loading('Removing database entry...', { id: toastId })
        await db.delete(VideoData)
          .where(eq(VideoData.id, video.id))
        
        toast.success('Video deleted successfully!', { id: toastId })
        
        // Update parent component's state
        setVideoList?.(prev => prev.filter(v => v.id !== video.id))
      } catch (error) {
        // Revert optimistic update on error
        setLocalVideoList(prev => [...prev, video])
        console.error('Database deletion error:', error)
        toast.error('Error deleting video', { id: toastId })
        throw error
      }

    } catch (error) {
      // Revert optimistic update on error
      setLocalVideoList(prev => [...prev, video])
      console.error('Deletion error:', error)
      toast.error('Failed to delete video', {
        description: 'The video has been restored. Please try again.'
      })
    } finally {
      setIsDeletingMap(prev => ({ ...prev, [video.id]: false }))
    }
  }

  // Use useEffect to sync localVideoList with props
  useEffect(() => {
    setLocalVideoList(initialVideoList)
  }, [initialVideoList])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show" 
      className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
    >
      {localVideoList?.map((video, index) => (
        <motion.div
          key={video.id || index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          exit={{ opacity: 0, scale: 0.8 }} // Add exit animation
          className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-xl overflow-hidden
                     border border-zinc-800/10 shadow-xl transition-all duration-300
                     hover:border-blue-500/20 hover:shadow-blue-500/5"
        >
          <div 
            className="relative aspect-[9/16] overflow-hidden"
            onClick={() => {
              setOpenPlayDialog(true)
              setVideoId(video.id)
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            <Thumbnail
              component={RemotionVideo}
              compositionWidth={405} // 250
              compositionHeight={720} // 390
              frameToDisplay={30}
              durationInFrames={120}
              fps={30}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
              inputProps={{
                ...video,
                setDurationInFrames: (v) => console.log(v)
              }}
              className="transform transition-transform duration-300 group-hover:scale-105"
            />

            {/* Duration Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm 
                          rounded-md text-xs text-white flex items-center gap-1.5 z-20">
              <Clock size={12} />
              {video.duration || '00:00'}
            </div>

            {/* Delete Button with Animation */}
            <motion.div
              variants={trashIconVariants}
              initial="initial"
              whileHover="hover"
              onClick={(e) => handleDeleteVideo(e, video)}
              className="absolute bottom-3 right-3 p-2.5 bg-red-500/80 hover:bg-red-600 
                         backdrop-blur-sm rounded-full cursor-pointer z-20
                         opacity-0 group-hover:opacity-100 transition-all duration-300
                         transform hover:scale-110"
            >
              <Trash2 
                size={16} 
                className="text-white"
              />
            </motion.div>
          </div>

          {/* Loading/Deleting State */}
          {(video.isLoading || isDeletingMap[video.id]) && (
            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm 
                          flex items-center justify-center z-30">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent 
                            rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      ))}

      <div className='cursor-pointer'>
        <PlayerDialog 
          playVideo={openPlayDialog} 
          videoId={videoId} 
          onClose={() => {
            setOpenPlayDialog(Date.now())
            setVideoId(undefined)
          }}
        />    
      </div>
    </motion.div>
  )
}

export default VideoList
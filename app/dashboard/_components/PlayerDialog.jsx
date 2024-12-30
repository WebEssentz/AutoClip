"use client"

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import RemotionVideo from "./RemotionVideo"
import { Player } from "@remotion/player"
import { VideoData } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "@/src/firebaseConfig"

function PlayerDialog({ playVideo, videoId, onClose }) {
  const [openDialog, setOpenDialog] = useState(false)
  const [videoData, setVideoData] = useState(null)
  const [durationInFrames, setDurationInFrames] = useState(100)
  const [isExporting, setIsExporting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    setOpenDialog(playVideo)
    if (videoId) {
      getVideoData()
    }
  }, [playVideo, videoId])

  const getVideoData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId))
      
      if (!result?.[0]) {
        throw new Error('Video data not found')
      }

      if (!result[0].imageList?.length) {
        throw new Error('Video assets are incomplete')
      }

      setVideoData(result[0])
      // Calculate duration based on content
      const frameCount = result[0].captions?.length * 30 || 100 // 30 frames per caption or default
      setDurationInFrames(frameCount)
      
    } catch (error) {
      console.error('Error fetching video data:', error)
      setError(error.message)
      toast.error(error.message || "Failed to load video data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    if (!videoData) {
      toast.error("No video data available")
      return
    }

    const toastId = toast.loading("Starting export process...")
    setIsExporting(true)

    try {
      // Create unique filename with timestamp and videoId
      const fileName = `ai-short-video-files/${Date.now()}-${videoId}.mp4`
      const storageRef = ref(storage, fileName)

      // Get video element
      const videoElement = document.querySelector('video')
      if (!videoElement) {
        throw new Error("Video element not found")
      }

      // Setup MediaRecorder
      const stream = videoElement.captureStream()
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      const chunks = []

      // Handle recording data
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      
      // Handle recording completion
      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'video/mp4' })
          
          // Update progress
          toast.loading("Uploading video to storage...", { id: toastId })
          
          // Upload to Firebase
          await uploadBytes(storageRef, blob, { 
            contentType: 'video/mp4',
            customMetadata: {
              videoId: videoId,
              createdAt: new Date().toISOString()
            }
          })

          // Get shareable URL
          const downloadUrl = await getDownloadURL(storageRef)

          // Trigger download
          const downloadLink = document.createElement('a')
          downloadLink.href = downloadUrl
          downloadLink.download = `video-${videoId}-${Date.now()}.mp4`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)

          toast.success("Video exported successfully!", { id: toastId })
          router.replace('/dashboard')
        } catch (error) {
          console.error('Export error:', error)
          toast.error(error.message || "Failed to process video", { id: toastId })
        } finally {
          setIsExporting(false)
        }
      }

      // Start recording process
      toast.loading("Recording video...", { id: toastId })
      mediaRecorder.start()
      
      // Reset and play video
      videoElement.currentTime = 0
      await videoElement.play()
      
      // Stop recording after video duration
      const duration = videoElement.duration * 1000 || durationInFrames * (1000/30)
      setTimeout(() => {
        mediaRecorder.stop()
        videoElement.pause()
      }, duration)

    } catch (error) {
      console.error('Export error:', error)
      toast.error(error.message || "Failed to export video", { id: toastId })
      setIsExporting(false)
    }
  }

  if (!playVideo || !videoId) return null

  return (
    <Dialog open={openDialog} onOpenChange={() => {
      onClose()
      setError(null)
    }}>
      <DialogContent className="bg-background flex flex-col items-center max-w-4xl">
        <DialogHeader className="w-full">
          <DialogTitle className="text-3xl font-bold my-5 text-center">
            {isLoading ? "Loading Your Video..." : "Your Video is Ready"}
          </DialogTitle>
          
          <DialogDescription className="min-h-[450px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading video...</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => getVideoData()}
                >
                  Retry
                </Button>
              </div>
            ) : videoData ? (
              <div className="flex flex-col items-center mb-5 hover:cursor-pointer">
                <Player
                  component={RemotionVideo}
                  durationInFrames={Number(durationInFrames.toFixed(0))}
                  compositionHeight={450}
                  compositionWidth={300}
                  fps={30}
                  controls={true}
                  inputProps={{
                    ...videoData,
                    setDurationInFrames: setDurationInFrames,
                  }}
                />
              </div>
            ) : null}
          </DialogDescription>

          <div className="flex gap-10 mt-6 justify-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                router.replace('/dashboard')
                setOpenDialog(false)
              }}
              disabled={isExporting}
            >
              Cancel
            </Button>
            
            {!error && videoData && (
              <Button
                onClick={handleExport}
                disabled={isExporting || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Video
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PlayerDialog
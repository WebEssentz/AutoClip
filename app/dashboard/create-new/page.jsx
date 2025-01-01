"use client"

import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Progress } from '@/components/ui/progress'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/src/db'
import { VideoData } from '@/src/db/schema'
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { useUser } from '@clerk/nextjs'
import PlayerDialog from "@/app/dashboard/_components/PlayerDialog"
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { eq } from "drizzle-orm";
import { Users } from "@/src/db/schema";

// Add this near the top of your file
axios.defaults.timeout = 300000;
axios.defaults.maxContentLength = Infinity;
axios.defaults.maxBodyLength = Infinity;

function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const { user } = useUser();
  const {userDetail, setUserDetail} = useContext(UserDetailContext)
  // Add new state for tracking asset generation
  const [generationProgress, setGenerationProgress] = useState({
    script: false,
    audio: false,
    captions: false,
    images: 0,
    totalImages: 0
  });

  // Add this near the top of your file or in a separate config file
axios.defaults.timeout = 300000; // 5 minutes global timeout
axios.defaults.maxContentLength = Infinity;
axios.defaults.maxBodyLength = Infinity;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async (operation, maxRetries = 3, delay = 2000, backoff = 2) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Show retry attempt toast
        toast.loading(`Retrying... Attempt ${i + 2} of ${maxRetries}`, {
          duration: delay * Math.pow(backoff, i)
        });
        await wait(delay * Math.pow(backoff, i));
      }
    }
  }
  throw lastError;
};

// Update your API functions to use the retry logic:
const getVideoScript = async () => {
  const toastId = toast.loading('Generating video script...');
  setIsLoading(true);
  
  try {
    const resp = await retryOperation(
      () => axios.post('/api/get-video-script', {
        prompt: `Write a script to generate a ${formData.duration} video on topic: ${formData.topic} along with AI image prompts in ${formData.imageStyle}`
      }, {
        timeout: 60000
      })
    );

    if (resp.data.result) {
      setVideoScript(resp.data.result);
      setVideoData(prev => ({ ...prev, 'videoScript': resp.data.result }));
      setGenerationProgress(prev => ({ ...prev, script: true }));
      toast.success('Script generated successfully!', { id: toastId });
      await generateAudioFile(resp.data.result);
    }
  } catch (error) {
    toast.error('Failed to generate script after multiple attempts', { id: toastId });
    console.error("Error:", error);
    setIsLoading(false);
  }
};

const generateAudioFile = async (videoScriptData) => {
  const toastId = toast.loading('Generating audio...');
  
  try {
    let script = videoScriptData.map(item => item.ContentText).join(' ');
    const id = uuidv4();
    
    const resp = await retryOperation(
      () => axios.post('/api/generate-audio', {
        text: script,
        id: id
      }, {
        timeout: 300000
      }),
      5,
      3000
    );

    setAudioFileUrl(resp.data.result);
    setVideoData(prev => ({ ...prev, 'audioFileUrl': resp.data.result }));
    setGenerationProgress(prev => ({ ...prev, audio: true }));
    
    toast.success('Audio generated successfully!', { id: toastId });
    await generateAudioCaption(resp.data.result, videoScriptData);
  } catch (error) {
    toast.error('Failed to generate audio after multiple attempts', { id: toastId });
    console.error("Error:", error);
    setIsLoading(false);
  }
};

const generateAudioCaption = async (fileUrl, videoScriptData) => {
  const toastId = toast.loading('Generating captions...');
  
  try {
    const resp = await retryOperation(
      () => axios.post('/api/generate-caption', {
        audioFileUrl: fileUrl,
      }, {
        timeout: 120000
      })
    );

    setCaptions(resp.data.result);
    setVideoData(prev => ({ ...prev, 'captions': resp.data.result }));
    setGenerationProgress(prev => ({ ...prev, captions: true }));
    
    toast.success('Captions generated successfully!', { id: toastId });
    await generateImage(videoScriptData);
  } catch (error) {
    toast.error('Failed to generate captions after multiple attempts', { id: toastId });
    console.error("Error:", error);
    setIsLoading(false);
  }
};

const generateImage = async (videoScriptData) => {
  const toastId = toast.loading('Generating images...');
  setGenerationProgress(prev => ({ ...prev, totalImages: videoScriptData.length }));
  
  let images = [];
  try {
    for (let i = 0; i < videoScriptData.length; i++) {
      const element = videoScriptData[i];
      
      const resp = await retryOperation(
        () => axios.post('/api/generate-image', {
          prompt: element.imagePrompt,
        }, {
          timeout: 120000
        })
      );
      
      images.push(resp.data.result);
      setGenerationProgress(prev => ({ ...prev, images: i + 1 }));
      toast.loading(`Generating image ${i + 1}/${videoScriptData.length}...`, { id: toastId });
    }

    setImageList(images);
    setVideoData(prev => ({ ...prev, 'imageList': images }));
    toast.success('All images generated successfully!', { id: toastId });
  } catch (error) {
    toast.error('Failed to generate images after multiple attempts', { id: toastId });
    console.error("Error:", error);
    setIsLoading(false);
  }
};

  // Modified useEffect to check all assets are ready
  useEffect(() => {
    const allAssetsReady = 
      generationProgress.script && 
      generationProgress.audio && 
      generationProgress.captions && 
      generationProgress.images === generationProgress.totalImages &&
      generationProgress.totalImages > 0;

    if (allAssetsReady) {
      saveVideoData(videoData);
    }
  }, [generationProgress, videoData]);

  const saveVideoData = async (videoData) => {
    const toastId = toast.loading('Creating your video...');
    setIsLoading(true);

    try {
      const result = await db.insert(VideoData).values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress
      }).returning({ id: VideoData?.id });
      await updateUserCredits();
      if (result && result[0]?.id) {
        setVideoId(result[0].id);
        setPlayVideo(true);
        toast.success('Video created successfully!', { id: toastId });
      } else {
        toast.error('Failed to create video', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to save video', { id: toastId });
      console.error('Error saving video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserCredits = async () => {
    const previousCredits = userDetail?.credits;
    const deductionAmount = 10;
  
    // Optimistically update UI
    setUserDetail(prev => ({
      ...prev,
      credits: prev.credits - deductionAmount
    }));
  
    try {
      // Update database
      await db.update(Users)
        .set({
          credits: userDetail.credits - deductionAmount
        })
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
  
      toast.success(
        <div className="flex items-center gap-2">
          <span className="font-medium">Credits Updated</span>
          <span className="text-sm opacity-75">•</span>
          <span className="text-sm">{userDetail.credits - deductionAmount} credits remaining</span>
        </div>
      );
    } catch (error) {
      // Revert optimistic update
      setUserDetail(prev => ({
        ...prev,
        credits: previousCredits
      }));
      
      toast.error("Failed to update credits");
    }
  };
  
  const onCreateClickHandler = () => {
    const requiredCredits = 10;
  
    if (!userDetail?.credits || userDetail.credits < requiredCredits) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-medium">Insufficient Credits</span>
          <span className="text-sm opacity-75">
            {userDetail?.credits || 0}/10 credits available
          </span>
        </div>,
        {
          action: {
            label: "Add Credits",
            onClick: () => router.push('/pricing')
          },
        }
      );
      return;
    }
    
    getVideoScript();
  };

  const handleButtonClick = () => {
    if (currentStep === 3) {
      onCreateClickHandler();
    } else {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  }

  const progress = (Object.keys(formData).length / 3) * 100;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-background p-4 sm:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Create Your Story
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Transform your ideas into captivating visual narratives
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <Progress
            value={progress}
            className="h-1 bg-zinc-100 dark:bg-zinc-800"
          />
          <div className="flex justify-between mt-3">
            {['Content', 'Style', 'Duration'].map((step, index) => (
              <motion.span
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`text-sm ${index + 1 <= currentStep
                    ? 'text-primary font-medium'
                    : 'text-background dark:text-background'
                  }`}
              >
                {step}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Main Form - Removed background and border */}
        <motion.div
          className="p-1" // Minimal padding
          layout
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SelectTopic onUserSelect={onHandleInputChange} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SelectStyle onUserSelect={onHandleInputChange} />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SelectDuration onUserSelect={onHandleInputChange} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`px-6 py-2.5 rounded-lg 
          text-zinc-600 dark:text-zinc-300
          hover:bg-zinc-100 dark:hover:bg-zinc-800
          transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={currentStep === 1 || isLoading}
          >
            Previous
          </button>

          <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Step {currentStep} of 3
          </div>

          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg text-white
          dark:bg-white dark:text-black bg-black
          hover:bg-primary/90 dark:hover:bg-primary/90
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : currentStep === 3 ? (
              'Create'
            ) : (
              'Next'
            )}

          </button>
        </div>

        {videoId && playVideo && (
          <PlayerDialog 
            playVideo={playVideo} 
            videoId={videoId} 
            onClose={() => {
              setPlayVideo(false);
              setVideoId(null); // Reset ID when closing
            }}
          />
)}
      </div>
    </motion.div>
  )
}

export default CreateNew
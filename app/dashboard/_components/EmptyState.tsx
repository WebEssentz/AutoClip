'use client'

import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Plus, Video, ChevronRight, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

function EmptyState() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Slides data
  const slides = [
    {
      icon: <Video className="w-6 h-6 sm:w-8 sm:h-8 text-primary/80" />,
      title: "No clips yet",
      description: "Create your first clip to get started. It only takes a few minutes.",
    },
    {
      icon: <RefreshCcw className="w-6 h-6 sm:w-8 sm:h-8 text-primary/80" />,
      title: "Auto Generation",
      description: "Our AI helps you create professional videos automatically.",
    },
    // Add more slides as needed
  ];

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && slideIndex > 0) {
        setSlideIndex(slideIndex - 1);
      } else if (info.offset.x < 0 && slideIndex < slides.length - 1) {
        setSlideIndex(slideIndex + 1);
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.35 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="flex mt-3 flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20 
            mx-auto max-w-2xl rounded-lg border border-dashed border-border/50 
            bg-background/50 backdrop-blur-sm border-dashed border-2
            min-h-[50vh] sm:min-h-[60vh] touch-pan-y"
        >
          {/* Icon Container */}
          <motion.div 
            className="relative mb-4 sm:mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
            <div className="relative bg-background/80 backdrop-blur-sm rounded-full 
              p-3 sm:p-4 ring-1 ring-border/5"
            >
              {slides[slideIndex].icon}
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              {slides[slideIndex].title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-[280px] sm:max-w-sm">
              {slides[slideIndex].description}
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href={"/dashboard/create-new"} 
              className="block w-full sm:w-auto"
              onClick={(e) => isDragging && e.preventDefault()}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden w-full sm:w-auto
                  min-h-[44px] sm:min-h-[48px]
                  text-sm sm:text-base
                  px-4 sm:px-6"
              >
                <div className="absolute inset-0 bg-primary/10 
                  group-hover:bg-primary/20 group-active:bg-primary/30 
                  transition-colors duration-200" 
                />
                <span className="relative flex items-center gap-2 py-2">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create your first clip
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === slideIndex ? 'bg-primary' : 'bg-primary/20'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === slideIndex ? 1 : 0.8 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>

          {/* Swipe Indicator */}
          {slideIndex < slides.length - 1 && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 
                text-primary/30 hidden sm:flex items-center gap-1"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="text-xs">Swipe</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}

          {/* Date and Time
          <motion.div 
            className="absolute bottom-3 right-3 text-xs text-muted-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {new Date('2024-12-29T19:08:14').toLocaleDateString()}
          </motion.div> */}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default EmptyState
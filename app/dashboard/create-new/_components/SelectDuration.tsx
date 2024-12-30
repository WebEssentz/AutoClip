"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface DurationOption {
  value: string;
  seconds: number;
  description: string;
}

interface SelectDurationProps {
  onUserSelect: (type: string, value: string) => void;
}

function SelectDuration({ onUserSelect }: SelectDurationProps) {
  const [selectedDuration, setSelectedDuration] = useState<string>();

  const durationOptions: DurationOption[] = [
    { value: "15 Seconds", seconds: 15, description: "Quick and impactful" },
    { value: "30 Seconds", seconds: 30, description: "Balanced storytelling" },
    { value: "60 Seconds", seconds: 60, description: "Detailed narrative" },
  ];

  const handleSelect = (duration: string) => {
    setSelectedDuration(duration);
    onUserSelect('duration', duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Duration
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
        >
          How long should your story be?
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {durationOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "relative p-6 rounded-xl cursor-pointer",
              "bg-white dark:bg-background",
              "border-2 transition-all duration-300",
              selectedDuration === option.value
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiClock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {option.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default SelectDuration
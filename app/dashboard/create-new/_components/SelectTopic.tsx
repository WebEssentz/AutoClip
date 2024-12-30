// SelectTopic.tsx
"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { IconType } from 'react-icons'
import { FiBookOpen, FiGift, FiClock, FiStar, FiHeart, FiEdit3 } from 'react-icons/fi'

interface Option {
  value: string;
  label: string;
  icon: IconType;
  description: string;
}

interface SelectTopicProps {
  onUserSelect: (type: string, value: string) => void;
}

function SelectTopic({onUserSelect}: SelectTopicProps) {
  const options: Option[] = [
    {
      value: 'Custom Prompt',
      label: 'Custom Prompt',
      icon: FiEdit3,
      description: 'Create your own unique story'
    },
    {
      value: 'Random AI Story',
      label: 'Random AI Story',
      icon: FiStar,
      description: 'Let AI surprise you'
    },
    {
      value: 'Scary Story',
      label: 'Scary Story',
      icon: FiGift,
      description: 'Spine-chilling tales'
    },
    {
      value: 'Historical Facts',
      label: 'Historical Facts',
      icon: FiClock,
      description: 'Journey through time'
    },
    {
      value: 'Bed Time Story',
      label: 'Bed Time Story',
      icon: FiHeart,
      description: 'Peaceful night tales'
    },
    {
      value: 'Motivational Story',
      label: 'Motivational Story',
      icon: FiBookOpen,
      description: 'Inspiring narratives'
    }
  ];

  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [textareaValue, setTextareaValue] = useState('');

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
          Content
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
        >
          Choose your story type or create a custom one
        </motion.p>
      </div>

      <Select
        onValueChange={(value: string) => {
          setSelectedOption(value);
          if (value !== "Custom Prompt") {
            onUserSelect('topic', value);
          }
        }}
      >
        <SelectTrigger className="w-full p-6 text-lg bg-white dark:bg-background border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-all duration-200 hover:border-primary/50">
          <SelectValue placeholder="Select your content type" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="p-3 focus:bg-primary/5 cursor-pointer"
            >
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <option.icon className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </motion.div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AnimatePresence>
        {selectedOption === 'Custom Prompt' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Textarea 
              value={textareaValue}
              onChange={(e) => {
                setTextareaValue(e.target.value);
                onUserSelect('topic', e.target.value);
              }}
              className="min-h-[150px] p-4 text-lg bg-background dark:bg-background border-gray-200 
                dark:border-background rounded-xl shadow-sm transition-all duration-200
                focus:border-primary resize-none"
              placeholder="Write your story prompt here..."
            />
            <div className="mt-2 text-sm text-gray-500 flex justify-between">
              <span>Minimum 10 characters</span>
              <span>{textareaValue.length} characters</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SelectTopic
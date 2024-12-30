// SelectStyle.tsx
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

interface StyleOption {
  name: string;
  image: string;
  description: string;
}

interface SelectStyleProps {
  onUserSelect: (type: string, value: string) => void;
}

function SelectStyle({ onUserSelect }: SelectStyleProps) {
  const styleOptions: StyleOption[] = [
    {
      name: 'Realistic',
      image: '/real.png',
      description: 'True-to-life visualization'
    },
    {
      name: 'Cartoon',
      image: '/cartoon.png',
      description: 'Playful animated style'
    },
    {
      name: 'Comic',
      image: '/comic.png',
      description: 'Bold graphic novel look'
    },
    {
      name: 'WaterColor',
      image: '/water.png',
      description: 'Artistic painted effect'
    },
    {
      name: 'GTA',
      image: '/gta.png',
      description: 'Gaming-inspired visuals'
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
          Visual Style
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
        >
          Choose how your story will look
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {styleOptions.map((item) => (
          <motion.div
            key={item.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveredItem(item.name)}
            onHoverEnd={() => setHoveredItem(null)}
            onClick={() => {
              setSelectedOption(item.name);
              onUserSelect('imageStyle', item.name);
            }}
            className={`
              relative group cursor-pointer
              rounded-xl overflow-hidden
              bg-white dark:bg-gray-800
              shadow-sm hover:shadow-xl
              transition-all duration-300
              ${selectedOption === item.name ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="aspect-square relative overflow-hidden">
              <Image 
                alt={`${item.name} style preview`}
                src={item.image} 
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              <AnimatePresence>
                {selectedOption === item.name && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                  >
                    <FiCheck className="w-8 h-8 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium text-center">{item.name}</h3>
              <AnimatePresence>
                {hoveredItem === item.name && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-white/80 text-sm text-center mt-1"
                  >
                    {item.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default SelectStyle
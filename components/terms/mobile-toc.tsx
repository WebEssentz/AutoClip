// components/terms/mobile-toc.tsx
'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

interface Section {
  id: string;
  title: string;
}

interface MobileTOCProps {
  sections: Section[];
}

export function MobileTOC({ sections }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get the height of the fixed header if you have one
      const headerHeight = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      setActiveSection(sectionId);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-4 z-50 lg:hidden print:hidden"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm"
        >
          <HiOutlineMenu className="w-5 h-5" />
          <span className="sr-only">Open table of contents</span>
        </Button>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 z-50 p-6 shadow-xl lg:hidden"
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => setIsOpen(false)}
              >
                <HiX className="w-5 h-5" />
                <span className="sr-only">Close menu</span>
              </Button>

              {/* Mobile Menu Content */}
              <div className="pt-12">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                  Table of Contents
                </h2>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        w-full text-left px-4 py-2 rounded-lg text-sm
                        transition-colors duration-200
                        ${activeSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }
                      `}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {section.title}
                    </motion.button>
                  ))}
                </nav>

                {/* Additional Information */}
                <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Click on any section to navigate directly to it.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
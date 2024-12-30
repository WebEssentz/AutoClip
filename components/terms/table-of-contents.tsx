// components/terms/table-of-contents.tsx
'use client'

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "license", title: "2. Use License" },
  { id: "disclaimer", title: "3. Disclaimer" },
  { id: "limitations", title: "4. Limitations" },
  { id: "revisions", title: "5. Revisions" },
  { id: "privacy", title: "6. Privacy Policy" },
  { id: "contact", title: "7. Contact Us" },
];

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      );

      const currentSection = sectionElements.find(element => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-8">
      <nav className="space-y-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-6">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
          Table of Contents
        </h2>
        <div className="space-y-3">
          {sections.map((section) => (
            <motion.a
              key={section.id}
              href={`#${section.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                block text-sm transition-all duration-200
                ${activeSection === section.id
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              {section.title}
            </motion.a>
          ))}
        </div>
      </nav>
    </div>
  );
}
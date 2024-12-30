// components/terms/terms-section.tsx
'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi";

interface TermsSectionProps {
  id: string;
  title: string;
  content: string;
  list?: string[];
  date?: string;
}

export function TermsSection({ id, title, content, list, date }: TermsSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-6 sm:p-8"
    >
      <div className="flex items-start justify-between">
        <motion.h2 
          className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
        >
          {title}
        </motion.h2>
        <button
          onClick={copyToClipboard}
          className="text-zinc-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors"
          title="Copy section"
        >
          {copied ? (
            <HiOutlineCheck className="w-5 h-5" />
          ) : (
            <HiOutlineClipboard className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {content}
        </p>
        {list && (
          <ul className="mt-4 space-y-2">
            {list.map((item, index) => (
              <li 
                key={index} 
                className="text-zinc-600 dark:text-zinc-400 flex items-start"
              >
                <span className="mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {date && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: {date}
        </p>
      )}
    </motion.section>
  );
}
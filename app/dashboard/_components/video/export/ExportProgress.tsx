// components/video/export/ExportProgress.tsx
"use client";

import { motion } from "framer-motion";
import { ExportStatus } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ExportProgressProps {
  status: ExportStatus;
  progress: number;
  message: string;
}

export function ExportProgress({ status, progress, message }: ExportProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 w-full"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">{message}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-2" />
        {status === "processing" && (
          <motion.div
            className="absolute inset-0 bg-blue-500/20"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </div>

      {status === "processing" && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing video...</span>
        </div>
      )}
    </motion.div>
  );
}
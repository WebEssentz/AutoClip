// components/video/export/ExportButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { ExportProgress } from "./ExportProgress";

interface ExportButtonProps {
  onExport: () => Promise<void>;
  isDisabled?: boolean;
  credits?: number;
  subscription?: boolean;
}

export function ExportButton({
  onExport,
  isDisabled,
  credits = 0,
  subscription = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const requiredCredits = subscription ? 0 : 10;

  const handleExport = async () => {
    if (!subscription && credits < requiredCredits) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-medium">Insufficient Credits</span>
          <span className="text-sm opacity-75">
            {credits}/{requiredCredits} credits available
          </span>
        </div>,
        {
          action: {
            label: "Add Credits",
            onClick: () => window.location.href = '/pricing'
          },
        }
      );
      return;
    }

    setIsExporting(true);
    try {
      await onExport();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export video");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleExport}
        disabled={isDisabled || isExporting}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
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

      {!subscription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-zinc-500 dark:text-zinc-400 text-center"
        >
          This export will cost {requiredCredits} credits
          <br />
          You have {credits} credits remaining
        </motion.div>
      )}
    </div>
  );
}
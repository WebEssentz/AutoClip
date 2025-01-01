// app/EnhancedLayout.tsx
"use client"

import { lazy, Suspense } from 'react';
import Provider from "./provider";
import { useEffect, useState } from 'react';
import ThemeToggler from "@/components/ThemeToggler"; // Import directly for faster initial load

const Toaster = lazy(() => 
  import("sonner").then(mod => ({ 
    default: mod.Toaster 
  }))
);

export function EnhancedLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const preloadResources = async () => {
      if (typeof window !== 'undefined') {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
    };
    preloadResources();
  }, []);

  if (!mounted) return null;

  return (
    <Provider>
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggler />
      </div>
      <Suspense>
        <Toaster 
          position="top-center"
          richColors
          closeButton
        />
      </Suspense>
    </Provider>
  );
}
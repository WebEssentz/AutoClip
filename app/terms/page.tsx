// app/terms/page.tsx
'use client'

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/auth/logo";
import { TableOfContents } from "@/components/terms/table-of-contents";
import { TermsSection } from "@/components/terms/terms-section";
import { MobileTOC } from "@/components/terms/mobile-toc";
import { Button } from "@/components/ui/button";
import { HiOutlinePrinter, HiOutlineMail } from "react-icons/hi";
import { useTheme } from "next-themes";
import Link from "next/link";


const termsContent = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: "By accessing and using WebEssentz's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.",
    date: "2024-12-28"
  },
  {
    id: "license",
    title: "2. Use License",
    content: "Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.",
    list: [
      "This license shall automatically terminate if you violate any of these restrictions",
      "Upon termination, your viewing rights will cease immediately",
      "All materials provided are protected by intellectual property laws"
    ],
    date: "2024-12-28"
  },
  {
    id: "disclaimer",
    title: "3. Disclaimer",
    content: "The materials on WebEssentz's website are provided on an 'as is' basis. WebEssentz makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    date: "2024-12-28"
  },
  {
    id: "limitations",
    title: "4. Limitations",
    content: "In no event shall WebEssentz or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on WebEssentz's website.",
    date: "2024-12-28"
  },
  {
    id: "revisions",
    title: "5. Revisions",
    content: "The materials appearing on WebEssentz's website could include technical, typographical, or photographic errors. WebEssentz does not warrant that any of the materials on its website are accurate, complete or current. WebEssentz may make changes to the materials contained on its website at any time without notice.",
    date: "2024-12-28"
  },
  {
    id: "privacy",
    title: "6. Privacy Policy",
    content: "Your privacy is important to us. It is WebEssentz's policy to respect your privacy regarding any information we may collect from you across our website.",
    list: [
      "We only ask for personal information when we truly need it",
      "We store your data securely and protect it from unauthorized access",
      "We don't share any personally identifying information publicly"
    ],
    date: "2024-12-28"
  },
  {
    id: "contact",
    title: "7. Contact Us",
    content: "If you have any questions about these Terms, please contact us.",
    date: "2024-12-28"
  }
];

export default function TermsPage() {
  const { theme } = useTheme();
  
  const handlePrint = () => {
    window.print();
  };

  const handleContact = () => {
    window.location.href = "mailto:support@webEssentz.com";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-zinc-50/50 to-zinc-100/90 dark:from-zinc-900 dark:to-zinc-800 print:bg-white">
      {/* Mobile Table of Contents */}
      <MobileTOC sections={termsContent} />
      
      {/* Background accents - hide on print */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -z-10 print:hidden" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl -z-10 print:hidden" />
      
      {/* Clickable Brand Logo */}
      <div className="print:hidden fixed top-8 right-8 z-50">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <BrandLogo />
          </motion.div>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 pt-24 print:py-0 print:px-0">
        {/* Print Header */}
        <div className="hidden print:block text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.png" alt="WebEssentz" className="h-12" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Terms of Service</h1>
          <p className="text-sm text-zinc-600">Last updated: December 28, 2024</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16 print:space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4 print:hidden">
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white"
            >
              Terms of Service
            </motion.h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Last updated: December 28, 2024
            </p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-4 mt-8 print:hidden"
            >
              <Button
                onClick={handlePrint}
                variant="outline"
                className="group"
              >
                <HiOutlinePrinter className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Print
              </Button>
              <Button
                onClick={handleContact}
                variant="outline"
                className="group"
              >
                <HiOutlineMail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Contact Us
              </Button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block print:gap-0">
            {/* Table of Contents - Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-1 print:hidden">
              <TableOfContents />
            </div>

            {/* Terms Content */}
            <div className="lg:col-span-3 space-y-8 print:space-y-6">
              {termsContent.map((section) => (
                <TermsSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  list={section.list}
                  date={section.date}
                />
              ))}
              
              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-center space-y-4 print:hidden"
              >
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Need Help?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  If you have any questions about these terms, please don't hesitate to contact us.
                </p>
                <Button
                  onClick={handleContact}
                  variant="default"
                  className="mt-4"
                >
                  Contact Support
                </Button>
              </motion.div>

              {/* Print Footer */}
              <div className="hidden print:block text-center mt-12 pt-12 border-t">
                <p className="text-sm text-zinc-600">
                  For the latest version of these terms, please visit:{' '}
                  <span className="text-black">https://webEssentz.com/terms</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation - Only Print Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-200/50 dark:border-zinc-700/50 lg:hidden print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            onClick={handlePrint}
            variant="default"
            size="sm"
            className="w-full"
          >
            <HiOutlinePrinter className="w-4 h-4 mr-2" />
            Print Terms
          </Button>
        </div>
      </div>
    </div>
  );
}
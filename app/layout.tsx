// app/layout.tsx

import type { Metadata, Viewport } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: {
    template: '%s | AutoClip',
    default: 'AutoClip - AI Video Editor',
  },
  description: "AutoClip - AI-powered video editing platform that helps creators automate their editing process",
  keywords: ["video editing", "AI", "automation", "content creation", "video automation"],
  authors: [{ name: "WebEssentz" }],
  creator: "WebEssentz",
  publisher: "AutoClip",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://autoclip.com',
    title: 'AutoClip - AI Video Editor',
    description: 'AI-powered video editing platform that helps creators automate their editing process',
    siteName: 'AutoClip',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoClip - AI Video Editor',
    description: 'AI-powered video editing platform that helps creators automate their editing process',
    creator: '@WebEssentz',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport: Viewport = {
  themeColor: 'white',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
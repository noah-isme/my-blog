import AppClientShell from '../components/AppClientShell'
import '../styles/globals.css'
import type { Metadata } from 'next'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { ThemeProvider, ThemeToggleButton } from '../components/ThemeProvider'
import MainNav from '../components/MainNav'

import { cn } from '../lib/utils'
import { siteDescription, siteName, siteUrl } from '@/lib/seo'
import { inter, newsreader } from './fonts'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: '%s — Noah' },
  description: siteDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    url: siteUrl,
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          newsreader.variable,
          'bg-lightBg font-sans text-lightFg antialiased transition-colors duration-300 dark:bg-darkBg dark:text-darkFg',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded focus:bg-lightAccent focus:px-3 focus:py-2 focus:text-white dark:focus:bg-darkAccent"
        >
          Skip to content
        </a>
        <ThemeProvider>
              <main id="main" role="main" className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
                {children}
              </main>
          <header
            role="banner"
            className="sticky top-0 z-50 border-b border-lightFg/5 glassmorphism transition dark:border-darkFg/10"
          >
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Noah
              </Link>
              <MainNav />
              <ThemeToggleButton />
            </div>
            {/* SVG Minimalis Hero + Soft Gradient */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex justify-center">
              <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="90" cy="20" rx="80" ry="16" fill="url(#heroGradient)" fillOpacity="0.18" />
                <defs>
                  <linearGradient id="heroGradient" x1="0" y1="20" x2="180" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7F9CF5" />
                    <stop offset="1" stopColor="#F472B6" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg,rgba(37,99,235,0.08) 0%,rgba(244,114,182,0.08) 100%)',
                zIndex: -1,
                pointerEvents: 'none',
              }} />
            </div>
          </header>
          <footer role="contentinfo" className="mx-auto max-w-5xl px-4 py-10 text-sm text-lightFg/70 dark:text-darkFg/70 sm:px-6 relative">
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-0">
              <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="12" rx="54" ry="10" fill="url(#footerGradient)" fillOpacity="0.13" />
                <defs>
                  <linearGradient id="footerGradient" x1="0" y1="12" x2="120" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34D399" />
                    <stop offset="1" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="relative z-10 block">© {new Date().getFullYear()} Noah. Semua hak dilindungi.</span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

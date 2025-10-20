import '../styles/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ThemeProvider, ThemeToggleButton } from '../components/ThemeProvider'
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
          <header
            role="banner"
            className="sticky top-0 z-50 border-b border-lightFg/5 bg-white/80 backdrop-blur transition dark:border-darkFg/10 dark:bg-darkBg/80"
          >
            <nav aria-label="Navigasi utama" className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Noah
              </Link>
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link href="/blog" className="transition hover:text-lightAccent dark:hover:text-darkAccent">
                  Blog
                </Link>
                <Link href="/about" className="transition hover:text-lightAccent dark:hover:text-darkAccent">
                  About
                </Link>
                <Link href="/contact" className="transition hover:text-lightAccent dark:hover:text-darkAccent">
                  Contact
                </Link>
                <ThemeToggleButton />
              </div>
            </nav>
          </header>
          <main id="main" role="main" className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
            {children}
          </main>
          <footer role="contentinfo" className="mx-auto max-w-5xl px-4 py-10 text-sm text-lightFg/70 dark:text-darkFg/70 sm:px-6">
            © {new Date().getFullYear()} Noah. Semua hak dilindungi.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

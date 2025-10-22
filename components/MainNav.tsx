"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function MainNav({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Navigasi utama" className={className}>
      <div className="flex items-center gap-6 text-sm font-medium">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href === '/blog' && pathname.startsWith('/blog'))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-lightAccent dark:hover:text-darkAccent link-underline relative ${isActive ? 'text-lightAccent dark:text-darkAccent font-semibold' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded bg-lightAccent dark:bg-darkAccent transition-all" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

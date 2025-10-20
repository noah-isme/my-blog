import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Hubungi Noah—form sederhana dengan validasi client.',
  alternates: { canonical: canonical('/contact') },
  openGraph: {
    title: 'Contact',
    description: 'Hubungi Noah—form sederhana dengan validasi client.',
    url: canonical('/contact'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact',
    description: 'Hubungi Noah—form sederhana dengan validasi client.',
  },
}

export default function ContactPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight">Kontak</h1>
        <p className="mt-2 opacity-80">Kirim pesan; saya akan membalas secepatnya.</p>
      </header>
      <ContactForm />
    </section>
  )
}

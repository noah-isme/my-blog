'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const honeypot = (formData.get('company') as string | null)?.trim()
    if (honeypot) {
      setStatus('success')
      event.currentTarget.reset()
      return
    }

    setStatus('success')
    event.currentTarget.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4" aria-describedby="form-status">
      <div>
        <label className="block text-sm font-medium" htmlFor="name">
          Nama
        </label>
        <input id="name" name="name" required className="mt-1 w-full rounded border px-3 py-2" autoComplete="name" />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          required
          type="email"
          inputMode="email"
          className="mt-1 w-full rounded border px-3 py-2"
          autoComplete="email"
        />
      </div>

      <div className="sr-only" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="message">
          Pesan
        </label>
        <textarea id="message" name="message" required rows={5} className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      <button className="rounded bg-lightAccent px-3 py-2 text-white dark:bg-darkAccent">Kirim</button>

      <p id="form-status" role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {status === 'success' && 'Terima kasih! Pesan kamu sudah kami terima.'}
        {status === 'error' && 'Maaf, ada kendala. Coba lagi ya.'}
      </p>

      <p className="text-xs opacity-70">
        Dengan mengirim, kamu menyetujui kebijakan balasan: biasanya 1–3 hari kerja. Data hanya untuk keperluan balasan.
      </p>
    </form>
  )
}

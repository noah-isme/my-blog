import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="font-serif text-3xl font-extrabold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="opacity-80">Maaf, halaman yang kamu cari tidak ada.</p>
      <p>
        <Link className="underline" href="/">
          Kembali ke beranda
        </Link>{' '}
        ·{' '}
        <Link className="underline" href="/blog">
          Lihat semua artikel
        </Link>
      </p>
    </section>
  )
}

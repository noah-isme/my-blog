import { Inter, Newsreader } from 'next/font/google'
// Jika ingin menggunakan Playfair_Display, aktifkan import di bawah ini:
// import { Playfair_Display } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
export const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-news',
  adjustFontFallback: false,
})
// Jika memilih Playfair_Display sebagai alternatif serif:
// export const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '800'], display: 'swap', variable: '--font-news' })

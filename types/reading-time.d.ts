declare module 'reading-time' {
  interface ReadingTimeResult {
    text: string
    minutes: number
    time: number
    words: number
  }

  interface ReadingTimeOptions {
    wordsPerMinute?: number
  }

  export default function readingTime(text: string, options?: ReadingTimeOptions): ReadingTimeResult
}

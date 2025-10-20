declare module 'gray-matter' {
  interface GrayMatterFile<T extends Record<string, unknown>> {
    data: T
    content: string
    excerpt?: string
    orig: string
    language: string
    matter: string
  }

  interface GrayMatterOptions {
    excerpt?: boolean
    engines?: Record<string, (input: string) => unknown>
  }

  export default function matter<T extends Record<string, unknown> = Record<string, unknown>>(
    input: string,
    options?: GrayMatterOptions,
  ): GrayMatterFile<T>
}

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Noah — Blog'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0B1020',
          color: '#E5E7EB',
          padding: '64px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.8 }}>noah.dev</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

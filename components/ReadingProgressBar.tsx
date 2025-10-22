import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const percent = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(percent)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      zIndex: 60,
      pointerEvents: 'none',
      background: 'transparent',
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #2563EB 0%, #F472B6 100%)',
        transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1)',
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(80,80,180,0.08)',
      }} />
    </div>
  )
}

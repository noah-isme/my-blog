import { useEffect } from 'react'

export default function SoundFeedback() {
  useEffect(() => {
    const clickAudio = new Audio('/click.mp3')
    const hoverAudio = new Audio('/hover.mp3')
    clickAudio.volume = 0.13
    hoverAudio.volume = 0.08

    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input[type="submit"]')) {
        clickAudio.currentTime = 0
        clickAudio.play()
      }
    }
    const handleHover = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input[type="submit"]')) {
        hoverAudio.currentTime = 0
        hoverAudio.play()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('mouseover', handleHover)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('mouseover', handleHover)
    }
  }, [])
  return null
}

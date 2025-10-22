import { ButtonHTMLAttributes, forwardRef, useRef } from 'react'

// Tombol dengan efek ripple dan press
const RippleButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function RippleButton({ children, className = '', ...props }, ref) {
    const rippleRef = useRef<HTMLSpanElement>(null)

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget
      const circle = document.createElement('span')
      const diameter = Math.max(button.clientWidth, button.clientHeight)
      const radius = diameter / 2
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`
      circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`
      circle.className = 'ripple-effect'
      rippleRef.current?.appendChild(circle)
      setTimeout(() => {
        circle.remove()
      }, 500)
    }

    return (
      <button
        ref={ref}
        className={`ripple-btn ${className}`}
        onClick={(e) => {
          createRipple(e)
          props.onClick?.(e)
        }}
        {...props}
      >
        <span ref={rippleRef} className="ripple-container" />
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

export default RippleButton

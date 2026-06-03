import { useEffect, useState } from 'react'

/** Show the button after scrolling this many pixels. */
const SHOW_AFTER_PX = 320

const styles = {
  button: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 50,
    padding: '10px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.18)',
    background: '#a18770',
    color: '#fff',
    fontWeight: 750,
    fontSize: 14,
    fontFamily: '"Times New Roman", Times, serif',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(26, 27, 75, 0.22)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(8px)',
  },
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
    transform: 'translateY(0)',
  },
}

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{ ...styles.button, ...(visible ? styles.visible : styles.hidden) }}
    >
      ↑ Back to top
    </button>
  )
}

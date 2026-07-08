'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/*
  Scroll-driven fade + slide-up reveal.

  - Hidden state (opacity 0 / translateY(24px)) is applied AFTER mount so
    JS-off / SSR visitors always see content immediately.
  - IntersectionObserver flips to visible; once visible, it stays visible.
  - `index` staggers the transition-delay so grid items cascade smoothly.
  - Uses --ease-premium from editable-global.css.
*/

type Props = {
  children: ReactNode
  index?: number
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  delay?: number
  once?: boolean
  step?: number
}

export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  style,
  delay,
  once = true,
  step = 80,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const state = !mounted ? '' : visible ? 'is-visible' : 'is-hidden'
  const transitionDelay = `${delay ?? Math.min(index * step, 640)}ms`
  const Tag = as as keyof React.JSX.IntrinsicElements
  const composed = ['editable-reveal', state, className].filter(Boolean).join(' ')
  const composedStyle: CSSProperties = { transitionDelay, ...style }

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref as React.MutableRefObject<HTMLElement>} className={composed} style={composedStyle}>
      {children}
    </Tag>
  )
}

export default EditableReveal

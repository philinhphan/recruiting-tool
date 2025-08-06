"use client"

import React, { useState, useEffect, useRef } from "react"

// TypeWriter component with character-by-character fade-in
interface TypeWriterProps {
  text: string
  speed?: number
  className?: string
  delay?: number
  startOnView?: boolean
}

export const TypeWriter: React.FC<TypeWriterProps> = ({ 
  text,
  speed = 0,
  className = "",
  delay = 0,
  startOnView = true
}) => {
  const [visibleChars, setVisibleChars] = useState(0)
  const [started, setStarted] = useState(!startOnView && delay === 0)
  const [inView, setInView] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  // Intersection Observer to detect when element comes into view
  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start slightly before fully visible
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [startOnView, inView])

  // Handle delay after coming into view
  useEffect(() => {
    if (startOnView && inView && !started) {
      if (delay > 0) {
        const delayTimer = setTimeout(() => {
          setStarted(true)
        }, delay)
        return () => clearTimeout(delayTimer)
      } else {
        setStarted(true)
      }
    } else if (!startOnView && delay > 0 && !started) {
      const delayTimer = setTimeout(() => {
        setStarted(true)
      }, delay)
      return () => clearTimeout(delayTimer)
    }
  }, [startOnView, inView, delay, started])

  // Character animation
  useEffect(() => {
    if (started && visibleChars < text.length) {
      const timer = setTimeout(() => {
        setVisibleChars(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [started, visibleChars, text.length, speed])

  return (
    <span ref={elementRef} className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-opacity duration-300 ${index < visibleChars ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ transitionDelay: `${index * 5}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

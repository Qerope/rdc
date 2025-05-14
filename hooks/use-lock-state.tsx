"use client"

import { useState, useEffect } from "react"

export function useLockState() {
  const [isLocked, setIsLocked] = useState(false)

  const toggleLock = () => {
    setIsLocked((prev) => !prev)
  }

  // Handle escape key to exit lock mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLocked) {
        setIsLocked(false)
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isLocked])

  return { isLocked, toggleLock }
}

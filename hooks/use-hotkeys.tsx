"use client"

import { useEffect, useCallback } from "react"

export function useHotkeys(key: string, callback: () => void) {
  // Create a stable callback reference
  const stableCallback = useCallback(callback, [callback])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = key.toLowerCase().split("+")
      const modifiers = {
        alt: keys.includes("alt"),
        ctrl: keys.includes("ctrl"),
        shift: keys.includes("shift"),
        meta: keys.includes("meta"),
      }

      const mainKey = keys.filter((k) => !["alt", "ctrl", "shift", "meta"].includes(k))[0]

      if (
        event.key.toLowerCase() === mainKey &&
        event.altKey === modifiers.alt &&
        event.ctrlKey === modifiers.ctrl &&
        event.shiftKey === modifiers.shift &&
        event.metaKey === modifiers.meta
      ) {
        event.preventDefault()
        stableCallback()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    console.log(`Registered hotkey: ${key}`)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      console.log(`Unregistered hotkey: ${key}`)
    }
  }, [key, stableCallback])
}

"use client"

import { useEffect, useRef } from "react"

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: HTMLElement,
) {
  // Create a ref that stores the handler
  const savedHandler = useRef(handler)

  // Update ref.current if handler changes
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement = element || window

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: WindowEventMap[K]) => savedHandler.current(event)

    // Add event listener
    targetElement.addEventListener(eventName, eventListener as EventListener)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener as EventListener)
    }
  }, [eventName, element])
}

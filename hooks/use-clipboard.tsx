"use client"

import { useState, useEffect, useCallback } from "react"

export function useClipboard(sendCallback: (text: string) => void) {
  const [clipboardText, setClipboardText] = useState<string>("")
  const [isClipboardSupported, setIsClipboardSupported] = useState<boolean>(false)

  // Check if clipboard API is supported
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsClipboardSupported(navigator.clipboard !== undefined && typeof navigator.clipboard.readText === "function")
    }
  }, [])

  // Read clipboard content
  const readClipboard = useCallback(async () => {
    if (!isClipboardSupported) return

    try {
      const text = await navigator.clipboard.readText()
      setClipboardText(text)
    } catch (error) {
      console.error("Failed to read clipboard:", error)
      // Don't update state on error to keep previous clipboard content
    }
  }, [isClipboardSupported])

  // Send clipboard content
  const sendClipboardContent = useCallback(() => {
    if (clipboardText) {
      sendCallback(clipboardText)
    }
  }, [clipboardText, sendCallback])

  return {
    clipboardText,
    readClipboard,
    isClipboardSupported,
    sendClipboardContent,
  }
}

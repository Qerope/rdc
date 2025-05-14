"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface RemoteDesktopProps {
  url: string
  isLocked: boolean
  isReloading: boolean
  isController: boolean
  isFullscreen: boolean
}

export function RemoteDesktop({ url, isLocked, isReloading, isController, isFullscreen }: RemoteDesktopProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Reload iframe when isReloading changes to true
  useEffect(() => {
    if (isReloading && iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = url
    }
  }, [isReloading, url])

  // Handle keyboard events when locked
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked && iframeRef.current) {
        // Focus the iframe to capture keyboard input
        iframeRef.current.focus()

        // Prevent default browser shortcuts when locked
        if (e.altKey || e.ctrlKey || e.metaKey) {
          // Allow Alt+L to escape the lock
          if (e.altKey && e.key.toLowerCase() === "l") {
            return
          }

          // Allow Alt+R for reload
          if (e.altKey && e.key.toLowerCase() === "r") {
            return
          }

          // Allow Alt+F for fullscreen toggle
          if (e.altKey && e.key.toLowerCase() === "f") {
            return
          }

          // Allow Alt+V for clipboard paste
          if (e.altKey && e.key.toLowerCase() === "v") {
            return
          }

          e.preventDefault()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLocked])

  // Handle mouse events when locked
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isLocked && iframeRef.current) {
        const rect = iframeRef.current.getBoundingClientRect()

        // Check if mouse is outside iframe bounds
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          // Move focus back to iframe
          iframeRef.current.focus()
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isLocked])

  return (
    <div className={`relative w-full h-full bg-gray-800 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Loading remote desktop...</span>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        className={`w-full h-full border-0 ${isLocked ? "cursor-none" : ""}`}
        onLoad={handleIframeLoad}
        allow="clipboard-read; clipboard-write; fullscreen"
        title={isController ? "Controller Remote Desktop" : "Viewer Remote Desktop"}
      />

      {isLocked && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-20">
          Input Locked to Remote (Alt+L to unlock)
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { RemoteDesktop } from "@/components/remote-desktop"
import { ChatPanel } from "@/components/chat-panel"
import { useRouter } from "next/navigation"

export default function ViewerPage() {
  const [layout, setLayout] = useState("3/1") // Default 3/1 layout
  const [isReloading, setIsReloading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [userRole, setUserRole] = useState("")

  // Check if user has a name set - with browser check
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const storedUsername = window.localStorage.getItem("username")
      const storedUserRole = window.localStorage.getItem("userRole")

      setUsername(storedUsername || "")
      setUserRole(storedUserRole || "")

      if (!storedUsername || storedUserRole !== "viewer") {
        router.push("/")
      }
    }
  }, [router])

  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+L: Toggle lock
      if (e.altKey && e.key.toLowerCase() === "l") {
        e.preventDefault()
        setIsLocked((prev) => !prev)
      }

      // Alt+R: Force reload
      if (e.altKey && e.key.toLowerCase() === "r") {
        e.preventDefault()
        setIsReloading(true)
        setTimeout(() => setIsReloading(false), 1000)
      }

      // Alt+F: Toggle fullscreen
      if (e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault()
        setIsFullscreen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Calculate layout proportions
  const getLayoutStyle = () => {
    if (isFullscreen) {
      return { gridTemplateColumns: "100% 0%" }
    }

    const [left, right] = layout.split("/")
    const leftRatio = Number.parseInt(left)
    const rightRatio = Number.parseInt(right)
    const totalRatio = leftRatio + rightRatio

    return {
      gridTemplateColumns: `${(leftRatio / totalRatio) * 100}% ${(rightRatio / totalRatio) * 100}%`,
    }
  }

  if (!username || userRole !== "viewer") {
    return null // Don't render anything until we've checked credentials
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 overflow-hidden">
        <div className="grid h-full" style={getLayoutStyle()}>
          <div className="relative">
            <RemoteDesktop
              url="https://qerope.ddns.net/guacamole/#/client/Y"
              isLocked={isLocked}
              isReloading={isReloading}
              isController={false}
              isFullscreen={isFullscreen}
            />
          </div>
          {!isFullscreen && (
            <ChatPanel
              role="viewer"
              username={username}
              isLocked={isLocked}
              onToggleLock={() => setIsLocked((prev) => !prev)}
              onReload={() => {
                setIsReloading(true)
                setTimeout(() => setIsReloading(false), 1000)
              }}
              onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
              isFullscreen={isFullscreen}
              currentLayout={layout}
              onLayoutChange={setLayout}
            />
          )}
        </div>
      </main>
    </div>
  )
}

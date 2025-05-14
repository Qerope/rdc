"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize Socket.io
    const initSocket = async () => {
      try {
        // First, make sure the socket server is running
        await fetch("/api/socket")

        const socketInstance = io({
          path: "/api/socket",
          addTrailingSlash: false,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 5000,
        })

        socketInstance.on("connect", () => {
          console.log("Socket connected")
          setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected")
          setIsConnected(false)
        })

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error)
          setIsConnected(false)
        })

        setSocket(socketInstance)
      } catch (error) {
        console.error("Failed to initialize socket:", error)
        setIsConnected(false)
      }
    }

    initSocket()

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { io, type Socket } from "socket.io-client"

// Message type definition
interface Message {
  id: string
  role: "controller" | "viewer"
  content: string
  timestamp: Date
  username: string
}

// Function to generate a unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}

// Local storage key for offline messages
const OFFLINE_MESSAGES_KEY = "offline-messages"

export function useChatMessages(role: string, username: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [offlineMessages, setOfflineMessages] = useState<Message[]>([])

  // Load offline messages from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(OFFLINE_MESSAGES_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setOfflineMessages(
            parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          )
        }
      } catch (error) {
        console.error("Failed to load offline messages:", error)
      }
    }
  }, [])

  // Initialize socket connection
  useEffect(() => {
    // Initialize Socket.io
    const socketInstance = io({
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)

      // Join the chat room
      socketInstance.emit("join", { role, username })

      // Send any offline messages
      if (offlineMessages.length > 0) {
        offlineMessages.forEach((msg) => {
          socketInstance.emit("chat_message", msg)
        })
        setOfflineMessages([])
        if (typeof window !== "undefined") {
          localStorage.removeItem(OFFLINE_MESSAGES_KEY)
        }
      }
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

    return () => {
      socketInstance.disconnect()
    }
  }, [role, username, offlineMessages])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return

    // Handle incoming messages
    const handleChatMessage = (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.some((m) => m.id === message.id)) return prev

        // Convert timestamp string to Date if needed
        const processedMessage = {
          ...message,
          timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp),
        }

        return [...prev, processedMessage]
      })
    }

    // Listen for chat messages
    socket.on("chat_message", handleChatMessage)

    // Listen for message history when joining
    socket.on("message_history", (history: Message[]) => {
      const processedHistory = history.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
      }))
      setMessages(processedHistory)
    })

    return () => {
      socket.off("chat_message", handleChatMessage)
      socket.off("message_history")
    }
  }, [socket])

  // Send a new message
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return

      const newMessage: Message = {
        id: generateId(),
        role: role as "controller" | "viewer",
        content: content.trim(),
        timestamp: new Date(),
        username: username || role,
      }

      // Send message via socket if connected
      if (socket && isConnected) {
        socket.emit("chat_message", newMessage)
      } else {
        // Store message locally if offline
        const updatedOfflineMessages = [...offlineMessages, newMessage]
        setOfflineMessages(updatedOfflineMessages)

        // Save to localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem(OFFLINE_MESSAGES_KEY, JSON.stringify(updatedOfflineMessages))
        }

        // Add to local messages for immediate display
        setMessages((prev) => [...prev, newMessage])
      }
    },
    [role, username, socket, isConnected, offlineMessages],
  )

  return { messages, sendMessage, isConnected }
}

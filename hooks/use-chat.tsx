"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useSocket } from "./use-socket"

interface Message {
  id: string
  role: "controller" | "viewer"
  content: string
  timestamp: Date
  username: string
}

// Fallback storage when socket isn't working
const LOCAL_STORAGE_KEY = "remote-collaboration-messages"

export function useChat(role: "controller" | "viewer") {
  const [messages, setMessages] = useState<Message[]>([])
  const { socket, isConnected } = useSocket()

  // Load initial messages from localStorage
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage:", error)
    }
  }, [])

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return

    // Listen for incoming messages
    const handleChatMessage = (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.some((m) => m.id === message.id)) return prev
        const newMessages = [...prev, message]
        // Store in localStorage as backup
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMessages))
        } catch (error) {
          console.error("Failed to save messages to localStorage:", error)
        }
        return newMessages
      })
    }

    socket.on("chat_message", handleChatMessage)

    return () => {
      socket.off("chat_message", handleChatMessage)
    }
  }, [socket])

  // Send a new message
  const sendMessage = (content: string) => {
    const username = localStorage.getItem("username") || role

    const newMessage: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      username,
    }

    // Add message to local state immediately
    setMessages((prev) => {
      const newMessages = [...prev, newMessage]
      // Store in localStorage as backup
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMessages))
      } catch (error) {
        console.error("Failed to save messages to localStorage:", error)
      }
      return newMessages
    })

    // Send message via socket if connected
    if (socket && isConnected) {
      socket.emit("chat_message", newMessage)
    }
  }

  return { messages, sendMessage }
}

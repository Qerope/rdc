"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Lock,
  Unlock,
  RefreshCw,
  Maximize2,
  Minimize2,
  Layout,
  Clipboard,
  ChevronDown,
  Wifi,
  WifiOff,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useClipboard } from "@/hooks/use-clipboard"
import { useChatMessages } from "@/hooks/use-chat-messages"
import { useToast } from "@/hooks/use-toast"

interface ChatPanelProps {
  role: "controller" | "viewer"
  username: string
  isLocked: boolean
  onToggleLock: () => void
  onReload: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  currentLayout: string
  onLayoutChange: (layout: string) => void
}

const LAYOUTS = ["1/1", "2/1", "3/1", "4/1", "5/1"]

export function ChatPanel({
  role,
  username,
  isLocked,
  onToggleLock,
  onReload,
  onToggleFullscreen,
  isFullscreen,
  currentLayout,
  onLayoutChange,
}: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [showLayoutDropdown, setShowLayoutDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [lastConnectionState, setLastConnectionState] = useState<boolean | null>(null)

  // Real-time chat functionality
  const { messages, sendMessage, isConnected } = useChatMessages(role, username)

  // Show connection status changes
  useEffect(() => {
    if (lastConnectionState === null) {
      setLastConnectionState(isConnected)
      return
    }

    setLastConnectionState(isConnected)
  }, [isConnected, lastConnectionState, toast])

  // Clipboard functionality
  const { clipboardText, readClipboard, sendClipboardContent } = useClipboard((text) => {
    sendMessage(text)
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Read clipboard on focus
  useEffect(() => {
    const handleFocus = () => {
      readClipboard()
    }

    window.addEventListener("focus", handleFocus)
    // Initial read
    readClipboard()

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [readClipboard])

  // Register Alt+V shortcut for clipboard paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "v") {
        e.preventDefault()
        if (clipboardText) {
          sendMessage(clipboardText)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [clipboardText, sendMessage])

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Clipboard Preview */}
      {clipboardText && (
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Clipboard className="h-3 w-3 mr-1" />
              <span>Clipboard (Alt+V to send)</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => sendClipboardContent()}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-1 text-xs text-gray-700 dark:text-gray-300 line-clamp-3 bg-white dark:bg-gray-800 p-1 rounded border border-gray-200 dark:border-gray-700">
            {clipboardText}
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Chat</h2>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" title="Connected" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" title="Disconnected" />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant={isLocked ? "destructive" : "outline"}
              size="icon"
              onClick={onToggleLock}
              className="h-8 w-8"
              title="Toggle input lock (Alt+L)"
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="icon" onClick={onReload} className="h-8 w-8" title="Force reload (Alt+R)">
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFullscreen}
              className="h-8 w-8"
              title="Toggle fullscreen (Alt+F)"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center gap-1"
                onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
                title="Change layout"
              >
                <Layout className="h-4 w-4" />
                <span className="text-xs">{currentLayout}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {showLayoutDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        currentLayout === layout
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        onLayoutChange(layout)
                        setShowLayoutDropdown(false)
                      }}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {role === "controller" ? "You are the controller" : "You are the viewer"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isConnected ? "Connected" : "Offline - messages will sync when reconnected"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === role ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start max-w-[80%] ${message.role === role ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className={`h-8 w-8 ${message.role === role ? "ml-2" : "mr-2"}`}>
                    <AvatarFallback className={message.role === "controller" ? "bg-blue-500" : "bg-green-500"}>
                      {message.username ? message.username[0].toUpperCase() : message.role === "controller" ? "C" : "V"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.role === role
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.role === role ? "text-right" : "text-left"}`}>
                      {message.username} • {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

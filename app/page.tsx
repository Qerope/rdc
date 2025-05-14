"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function Home() {
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("controller")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Clear any existing messages when starting a new session
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Optional: Clear messages when starting a new session
      // window.localStorage.removeItem("remote-collaboration-messages")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      alert("Please enter your name")
      return
    }

    setIsLoading(true)

    // Store username in localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("username", username)
      window.localStorage.setItem("userRole", role)
    }

    // Redirect to appropriate page
    setTimeout(() => {
      router.push(`/${role}`)
    }, 500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Remote Collaboration</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your name and choose your role to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Your Name</Label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Select Your Role</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                type="button"
                variant={role === "controller" ? "default" : "outline"}
                className="w-full py-6"
                onClick={() => setRole("controller")}
              >
                Controller
              </Button>
              <Button
                type="button"
                variant={role === "viewer" ? "default" : "outline"}
                className="w-full py-6"
                onClick={() => setRole("viewer")}
              >
                Viewer
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {role === "controller"
                ? "Controller can interact with the remote desktop"
                : "Viewer can observe and chat with the controller"}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connecting..." : "Join Session"}
          </Button>
        </form>
      </div>
    </div>
  )
}

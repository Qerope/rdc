"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

export function UserForm() {
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("controller")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      alert("Please enter your name")
      return
    }

    setIsLoading(true)

    // Store username in localStorage
    localStorage.setItem("username", username)

    // Redirect to appropriate page
    setTimeout(() => {
      router.push(`/${role}`)
    }, 500)
  }

  return (
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
        <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="controller" id="controller" />
            <Label htmlFor="controller" className="cursor-pointer">
              Controller (can interact with remote desktop)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="viewer" id="viewer" />
            <Label htmlFor="viewer" className="cursor-pointer">
              Viewer (can observe and chat)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connecting..." : "Join Session"}
      </Button>
    </form>
  )
}

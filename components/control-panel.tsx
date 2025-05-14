"use client"

import { Button } from "@/components/ui/button"
import { Lock, Unlock, RefreshCw, Keyboard, Mouse, Maximize2, Minimize2 } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ControlPanelProps {
  isLocked: boolean
  onToggleLock: () => void
  onReload: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
}

export function ControlPanel({
  isLocked,
  onToggleLock,
  onReload,
  onToggleFullscreen,
  isFullscreen,
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [lockKeyboard, setLockKeyboard] = useState(true)
  const [lockMouse, setLockMouse] = useState(true)

  return (
    <TooltipProvider>
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 rounded-lg transition-all duration-200 ${
          isExpanded ? "p-3" : "p-2"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={isLocked ? "destructive" : "outline"} size="sm" onClick={onToggleLock}>
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                {isExpanded && <span className="ml-1">{isLocked ? "Unlock" : "Lock"}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle input lock (Alt+L)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onReload}>
                <RefreshCw className="h-4 w-4" />
                {isExpanded && <span className="ml-1">Reload</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Force reload (Alt+R)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {isExpanded && <span className="ml-1">{isFullscreen ? "Exit" : "Fullscreen"}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle fullscreen (Alt+F)</p>
            </TooltipContent>
          </Tooltip>

          {isExpanded && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={lockKeyboard ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLockKeyboard(!lockKeyboard)}
                  >
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle keyboard lock</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={lockMouse ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLockMouse(!lockMouse)}
                  >
                    <Mouse className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle mouse lock</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

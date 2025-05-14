"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Layout } from "lucide-react"

interface LayoutSelectorProps {
  currentLayout: string
  onLayoutChange: (layout: string) => void
}

const LAYOUTS = ["1/1", "2/1", "3/1", "4/1", "5/1"]

export function LayoutSelector({ currentLayout, onLayoutChange }: LayoutSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span>Layout: {currentLayout}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LAYOUTS.map((layout) => (
          <DropdownMenuItem
            key={layout}
            className={currentLayout === layout ? "bg-accent" : ""}
            onClick={() => onLayoutChange(layout)}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-12 items-center">
                <div
                  className="bg-primary h-3"
                  style={{
                    width: `${(Number.parseInt(layout.split("/")[0]) / (Number.parseInt(layout.split("/")[0]) + Number.parseInt(layout.split("/")[1]))) * 100}%`,
                  }}
                />
                <div
                  className="bg-secondary h-3"
                  style={{
                    width: `${(Number.parseInt(layout.split("/")[1]) / (Number.parseInt(layout.split("/")[0]) + Number.parseInt(layout.split("/")[1]))) * 100}%`,
                  }}
                />
              </div>
              <span>{layout}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

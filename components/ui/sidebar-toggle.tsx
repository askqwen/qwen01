"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
  variant?: "default" | "floating"
}

export function SidebarToggle({ isOpen, onToggle, className, variant = "default" }: SidebarToggleProps) {
  if (variant === "floating") {
    return (
      <Button
        onClick={onToggle}
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 h-10 w-10 rounded-full shadow-lg transition-all duration-200",
          "bg-background border border-border hover:bg-muted",
          "md:hidden", // Only show on mobile
          isOpen && "left-64", // Move when sidebar is open
          className,
        )}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn("h-8 w-8 hover:bg-muted transition-colors", "flex items-center justify-center", className)}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

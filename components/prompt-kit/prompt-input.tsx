"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PromptInputContextType {
  isLoading: boolean
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

const PromptInputContext = React.createContext<PromptInputContextType | undefined>(undefined)

function usePromptInput() {
  const context = React.useContext(PromptInputContext)
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput")
  }
  return context
}

interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
  children: React.ReactNode
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, isLoading, value, onValueChange, onSubmit, children, ...props }, ref) => {
    return (
      <PromptInputContext.Provider value={{ isLoading, value, onValueChange, onSubmit }}>
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      </PromptInputContext.Provider>
    )
  },
)
PromptInput.displayName = "PromptInput"

interface PromptInputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  ({ className, placeholder, ...props }, ref) => {
    const { value, onValueChange, onSubmit } = usePromptInput()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    }

    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full resize-none border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)
PromptInputTextarea.displayName = "PromptInputTextarea"

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptInputActions = React.forwardRef<HTMLDivElement, PromptInputActionsProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />
})
PromptInputActions.displayName = "PromptInputActions"

interface PromptInputActionProps {
  children: React.ReactNode
  tooltip?: string
}

const PromptInputAction = React.forwardRef<HTMLDivElement, PromptInputActionProps>(
  ({ children, tooltip, ...props }, ref) => {
    return (
      <div ref={ref} title={tooltip} {...props}>
        {children}
      </div>
    )
  },
)
PromptInputAction.displayName = "PromptInputAction"

export { PromptInput, PromptInputTextarea, PromptInputActions, PromptInputAction }

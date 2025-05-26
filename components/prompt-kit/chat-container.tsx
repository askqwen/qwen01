"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatContainer = React.forwardRef<HTMLDivElement, ChatContainerProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col", className)} {...props} />
})
ChatContainer.displayName = "ChatContainer"

export { ChatContainer }

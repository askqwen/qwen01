"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("py-3", className)} {...props} />
})
Message.displayName = "Message"

interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  markdown?: boolean
}

const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, children, markdown, ...props }, ref) => {
    if (markdown && typeof children === "string") {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                if (inline) {
                  return (
                    <code className="bg-muted rounded px-1 py-0.5 text-xs" {...props}>
                      {children}
                    </code>
                  )
                }
                return (
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                )
              },
              p: ({ children }) => <p className="mb-2 last:mb-0 text-sm">{children}</p>,
            }}
          >
            {children}
          </ReactMarkdown>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    )
  },
)
MessageContent.displayName = "MessageContent"

interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />
})
MessageActions.displayName = "MessageActions"

interface MessageActionProps {
  children: React.ReactNode
  tooltip?: string
  delayDuration?: number
}

const MessageAction = React.forwardRef<HTMLDivElement, MessageActionProps>(
  ({ children, tooltip, delayDuration, ...props }, ref) => {
    return (
      <div ref={ref} title={tooltip} {...props}>
        {children}
      </div>
    )
  },
)
MessageAction.displayName = "MessageAction"

export { Message, MessageContent, MessageActions, MessageAction }

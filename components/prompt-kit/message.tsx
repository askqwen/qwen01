"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { Button } from "@/components/ui/button"

// --- Początek: Komponenty z wzoru ---
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

interface MessageActionProps extends React.HTMLAttributes<HTMLDivElement> { // Dodano extends React.HTMLAttributes<HTMLDivElement> dla spójności z użyciem ...props
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
// --- Koniec: Komponenty z wzoru ---

export function ChatBasic() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "user",
      content: "Hello! Can you help me with a coding question?",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Of course! I'd be happy to help with your coding question. What would you like to know?",
    },
    {
      id: 3,
      role: "user",
      content: "How do I create a responsive layout with CSS Grid?",
    },
    {
      id: 4,
      role: "assistant",
      content:
        "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
    },
  ])

  const [isStreaming, setIsStreaming] = useState(false)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamContentRef = useRef("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const streamResponse = () => {
    if (isStreaming) return

    setIsStreaming(true)
    const fullResponse =
      "Yes, I'd be happy to explain more about CSS Grid! The `grid-template-columns` property defines the columns in your grid. The `repeat()` function is a shorthand that repeats a pattern. `auto-fit` will fit as many columns as possible in the available space. The `minmax()` function sets a minimum and maximum size for each column. This creates a responsive layout that automatically adjusts based on the available space without requiring media queries."

    const newMessageId = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        role: "assistant",
        content: "",
      },
    ])

    let charIndex = 0
    streamContentRef.current = ""

    streamIntervalRef.current = setInterval(() => {
      if (charIndex < fullResponse.length) {
        streamContentRef.current += fullResponse[charIndex]
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessageId
              ? { ...msg, content: streamContentRef.current }
              : msg
          )
        )
        charIndex++
      } else {
        clearInterval(streamIntervalRef.current!)
        setIsStreaming(false)
      }
    }, 30)
  }

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="flex h-[400px] w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-3">
        <div />
        <Button size="sm" onClick={streamResponse} disabled={isStreaming}>
          {isStreaming ? "Streaming..." : "Show Streaming"}
        </Button>
      </div>

      <ChatContainer 
        className="flex-1 space-y-4 p-4" 
        ref={chatContainerRef}
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant"

          return (
            <Message // Użycie nowego komponentu Message
              key={message.id}
              className={cn(
                "flex", // Usunięto items-start i space-x-2, ponieważ MessageAvatar zostało usunięte
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {/* MessageAvatar zostało usunięte zgodnie ze wzorcem */}
              <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                {isAssistant ? (
                  <MessageContent // Użycie nowego komponentu MessageContent
                    markdown
                    className="bg-secondary text-secondary-foreground prose dark:prose-invert rounded-lg p-3" // Dodano prose dla lepszego formatowania markdown, p-3 dla spójności
                  >
                    {message.content}
                  </MessageContent>
                ) : (
                  <MessageContent // Użycie nowego komponentu MessageContent
                    className="bg-primary text-primary-foreground rounded-lg p-3" // Dodano rounded-lg i p-3 dla spójności
                  >
                    {message.content}
                  </MessageContent>
                )}
              </div>
            </Message>
          )
        })}
      </ChatContainer>
    </div>
  )
}

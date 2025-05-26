"use client"

import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/prompt-kit/message"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Copy, Pencil, ThumbsDown, ThumbsUp, Trash } from "lucide-react"
import { useEffect, useRef } from "react"

interface ConversationWithActionsProps {
  messages: Array<{
    id: number
    role: "user" | "assistant"
    content: string
    reasoning?: string
    fallback?: boolean
  }>
}

function ConversationWithActions({ messages }: ConversationWithActionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-32">
      <ChatContainer className="space-y-6 px-4 py-8 min-h-full max-w-4xl mx-auto">
        {messages.map((message, index) => {
          const isAssistant = message.role === "assistant"
          const isLastMessage = index === messages.length - 1

          return (
            <Message
              key={`${message.id}-${index}`}
              className={cn("flex w-full flex-col gap-2", isAssistant ? "items-start" : "items-end")}
            >
              {isAssistant ? (
                <div className="group flex w-full flex-col gap-2 max-w-[85%]">
                  <MessageContent className="text-foreground w-full rounded-2xl bg-muted/50 px-4 py-3">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    {message.reasoning && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="text-xs text-muted-foreground">
                          <strong>Reasoning:</strong> {message.reasoning}
                        </div>
                      </div>
                    )}
                  </MessageContent>
                  <MessageActions
                    className={cn(
                      "flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                      isLastMessage && "opacity-100",
                    )}
                  >
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                        <Copy size={12} />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Upvote" delayDuration={100}>
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                        <ThumbsUp size={12} />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Downvote" delayDuration={100}>
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                        <ThumbsDown size={12} />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              ) : (
                <div className="group flex flex-col items-end gap-1 max-w-[85%]">
                  <MessageContent className="bg-primary text-primary-foreground rounded-2xl px-4 py-3">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  </MessageContent>
                  <MessageActions
                    className={cn("flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100")}
                  >
                    <MessageAction tooltip="Edit" delayDuration={100}>
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                        <Pencil size={12} />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Delete" delayDuration={100}>
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                        <Trash size={12} />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                        <Copy size={12} />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              )}
            </Message>
          )
        })}
      </ChatContainer>
    </div>
  )
}

export { ConversationWithActions }

"use client"

import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { ChatSidebar } from "@/components/prompt-kit/chat-sidebar"
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/prompt-kit/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { ResponseStream } from "@/components/prompt-kit/response-stream"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  Copy,
  Globe,
  Menu,
  Mic,
  MoreHorizontal,
  Pencil,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const models = [{ id: "qwen-qwq-32b", name: "Qwen QwQ 32B", provider: "Qwen" }]

const initialMessages = [
  {
    id: 1,
    role: "user",
    content: "Hello! Can you help me with a coding question?",
  },
  {
    id: 2,
    role: "assistant",
    content: "Of course! I'd be happy to help with your coding question. What would you like to know?",
  },
  {
    id: 3,
    role: "user",
    content: "How do I create a responsive layout with CSS Grid?",
  },
  {
    id: 4,
    role: "assistant",
    content: `# CSS Grid Responsive Layout

Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

This creates a grid where:
- **Columns automatically fit** as many as possible
- Each column is **at least 250px wide**
- Columns expand to fill available space
- There's a **1rem gap** between items

Would you like me to explain more about how this works?`,
    reasoning:
      "I provided a comprehensive answer about CSS Grid responsive layouts, including code examples and explanations of key concepts.",
  },
]

function ChatWithSidebar() {
  const [messages, setMessages] = useState(initialMessages)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string>("t1")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      const scrollHeight = scrollContainer.scrollHeight
      const clientHeight = scrollContainer.clientHeight
      const maxScrollTop = scrollHeight - clientHeight

      scrollContainer.scrollTo({
        top: maxScrollTop,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: prompt.trim(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setPrompt("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newUserMessage.content,
          model: selectedModel.id,
        }),
      })

      const data = await response.json()

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.content,
        reasoning: data.fallback
          ? `Odpowiedź zastępcza z powodu ograniczeń API`
          : `Odpowiedź wygenerowana przy użyciu modelu ${selectedModel.name} dla zapytania użytkownika.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Przepraszam, napotkałem błąd podczas przetwarzania twojego zapytania. Spróbuj ponownie.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentConversationId("")
    setPrompt("")
  }

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    // In a real app, you would load the conversation messages here
    setMessages(initialMessages)
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <ChatSidebar
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        currentConversationId={currentConversationId}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <SidebarInset>
        <main className="flex h-screen flex-col overflow-hidden">
          <header className="bg-background z-10 flex h-16 w-full shrink-0 items-center gap-3 border-b px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-muted transition-colors"
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="text-foreground font-medium">
                {currentConversationId ? "Project roadmap discussion" : "New Chat"}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <div className="text-sm text-muted-foreground flex items-center gap-2">{selectedModel.name}</div>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto pb-32">
            <ChatContainer className="space-y-0 px-3 py-8 min-h-full">
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant"
                const isLastMessage = index === messages.length - 1

                return (
                  <Message
                    key={message.id}
                    className={cn(
                      "mx-auto flex w-full max-w-3xl flex-col gap-1.5 px-0 md:px-4",
                      isAssistant ? "items-start" : "items-end",
                    )}
                  >
                    {isAssistant ? (
                      <div className="group flex w-full flex-col gap-0">
                        <MessageContent className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0">
                          <ResponseStream
                            textStream={message.content}
                            reasoning={message.reasoning}
                            mode="typewriter"
                            speed={20}
                            markdown={true}
                            className="text-sm leading-relaxed"
                            onComplete={scrollToBottom}
                          />
                        </MessageContent>
                        <MessageActions
                          className={cn(
                            "-ml-2 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                            isLastMessage && "opacity-100",
                          )}
                        >
                          <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <Copy size={14} />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Upvote" delayDuration={100}>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <ThumbsUp size={14} />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Downvote" delayDuration={100}>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <ThumbsDown size={14} />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    ) : (
                      <div className="group flex flex-col items-end gap-1">
                        <MessageContent className="bg-muted text-primary max-w-[80%] rounded-2xl px-4 py-2 sm:max-w-[70%]">
                          <span className="text-sm leading-relaxed">{message.content}</span>
                        </MessageContent>
                        <MessageActions
                          className={cn("flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100")}
                        >
                          <MessageAction tooltip="Edit" delayDuration={100}>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <Pencil size={14} />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Delete" delayDuration={100}>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <Trash size={14} />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <Copy size={14} />
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

          <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
            <div className="mx-auto max-w-3xl">
              <PromptInput
                isLoading={isLoading}
                value={prompt}
                onValueChange={setPrompt}
                onSubmit={handleSubmit}
                className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
              >
                <div className="flex flex-col">
                  <PromptInputTextarea
                    placeholder="Ask anything"
                    className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
                  />

                  <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
                    <div className="flex items-center gap-2">
                      <PromptInputAction tooltip="Add a new action">
                        <Button variant="outline" size="icon" className="size-9 rounded-full">
                          <Plus size={18} />
                        </Button>
                      </PromptInputAction>

                      <PromptInputAction tooltip="Search">
                        <Button variant="outline" className="rounded-full px-3 h-9">
                          <Globe size={18} />
                          Search
                        </Button>
                      </PromptInputAction>

                      <PromptInputAction tooltip="More actions">
                        <Button variant="outline" size="icon" className="size-9 rounded-full">
                          <MoreHorizontal size={18} />
                        </Button>
                      </PromptInputAction>
                    </div>
                    <div className="flex items-center gap-2">
                      <PromptInputAction tooltip="Voice input">
                        <Button variant="outline" size="icon" className="size-9 rounded-full">
                          <Mic size={18} />
                        </Button>
                      </PromptInputAction>

                      <Button
                        size="icon"
                        disabled={!prompt.trim() || isLoading}
                        onClick={handleSubmit}
                        className="size-9 rounded-full"
                      >
                        {!isLoading ? <ArrowUp size={18} /> : <span className="size-3 rounded-xs bg-white" />}
                      </Button>
                    </div>
                  </PromptInputActions>
                </div>
              </PromptInput>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ChatWithSidebar

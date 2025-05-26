"use client"

import { PromptInputWithActions } from "@/prompt-input-with-actions"
import { ConversationWithActions } from "@/conversation-with-actions"
import { ModelSelector } from "@/components/model-selector"
import { useState, useCallback } from "react"
import Image from "next/image"

const models = [
  { id: "qwen/qwq-32b:free", name: "Qwen QwQ 32B", provider: "Qwen" },
  { id: "qwen/qwen3-30b-a3b:free", name: "Qwen 3 30B", provider: "Qwen" },
  { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout", provider: "Meta" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1", provider: "DeepSeek" },
]

export default function Page() {
  const [messages, setMessages] = useState<
    Array<{
      id: number
      role: "user" | "assistant"
      content: string
      reasoning?: string
      fallback?: boolean
    }>
  >([])
  const [showConversation, setShowConversation] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessageId = Date.now()
      const newUserMessage = {
        id: userMessageId,
        role: "user" as const,
        content: content.trim(),
      }

      setMessages((prev) => [...prev, newUserMessage])
      setShowConversation(true)
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content.trim(),
            model: selectedModel.id,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.content) {
          throw new Error("No content received from API")
        }

        const assistantMessage = {
          id: userMessageId + 1,
          role: "assistant" as const,
          content: data.content,
          reasoning: data.reasoning || `Generated using ${selectedModel.name}`,
          fallback: data.fallback || false,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("Error generating response:", error)
        const errorMessage = {
          id: userMessageId + 1,
          role: "assistant" as const,
          content: "Przepraszam, wystąpił błąd podczas przetwarzania Twojego zapytania. Spróbuj ponownie.",
          reasoning: "Error occurred during API request",
          fallback: true,
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, selectedModel],
  )

  if (showConversation) {
    return (
      <div className="flex h-screen w-full flex-col bg-background">
        {/* Header with model selector */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="relative">
            <ModelSelector
              value={selectedModel.id}
              onValueChange={(value) => {
                const model = models.find((m) => m.id === value)
                if (model) setSelectedModel(model)
              }}
            />
          </div>
        </header>

        <ConversationWithActions messages={messages} />
        <PromptInputWithActions onSendMessage={addMessage} selectedModel={selectedModel} isLoading={isLoading} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header with model selector */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="relative">
          <ModelSelector
            value={selectedModel.id}
            onValueChange={(value) => {
              const model = models.find((m) => m.id === value)
              if (model) setSelectedModel(model)
            }}
          />
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 items-center justify-center -mt-32">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Logo" width={64} height={64} className="opacity-80" />
          </div>
          <h1 className="text-2xl font-semibold">Ask Qwen, Know More.</h1>
          <p className="text-muted-foreground">Choose a model and begin your conversation</p>
        </div>
      </div>

      <PromptInputWithActions onSendMessage={addMessage} selectedModel={selectedModel} isLoading={isLoading} />
    </div>
  )
}

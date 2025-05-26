"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Globe, Mic, MoreHorizontal, Plus } from "lucide-react"
import { useState } from "react"

interface PromptInputWithActionsProps {
  onSendMessage: (message: string) => void
  selectedModel?: { id: string; name: string; provider: string }
  isLoading?: boolean
}

function PromptInputWithActions({ onSendMessage, selectedModel, isLoading = false }: PromptInputWithActionsProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return

    onSendMessage(prompt)
    setPrompt("")
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl px-3 py-3 md:px-4 md:py-4">
        <PromptInput
          isLoading={isLoading}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-2xl border p-0 pt-0.5 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder={selectedModel ? `Ask ${selectedModel.name}...` : "Ask anything"}
              className="min-h-[32px] pt-1.5 pl-3 text-sm leading-[1.2] sm:text-sm md:text-sm"
              disabled={isLoading}
            />

            <PromptInputActions className="mt-2 flex w-full items-center justify-between gap-1.5 px-2.5 pb-1.5">
              <div className="flex items-center gap-1.5">
                <PromptInputAction tooltip="Add a new action">
                  <Button variant="outline" size="icon" className="size-8 rounded-full" disabled={isLoading}>
                    <Plus size={16} />
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="Search">
                  <Button variant="outline" className="rounded-full text-xs px-3 h-8" disabled={isLoading}>
                    <Globe size={16} />
                    Search
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="More actions">
                  <Button variant="outline" size="icon" className="size-8 rounded-full" disabled={isLoading}>
                    <MoreHorizontal size={16} />
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center gap-1.5">
                <PromptInputAction tooltip="Voice input">
                  <Button variant="outline" size="icon" className="size-8 rounded-full" disabled={isLoading}>
                    <Mic size={16} />
                  </Button>
                </PromptInputAction>

                <Button
                  size="icon"
                  disabled={!prompt.trim() || isLoading}
                  onClick={handleSubmit}
                  className="size-8 rounded-full"
                >
                  {!isLoading ? <ArrowUp size={16} /> : <span className="size-2.5 rounded-xs bg-white animate-pulse" />}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  )
}

export { PromptInputWithActions }

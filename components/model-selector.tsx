"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const models = [
  { id: "qwen/qwq-32b:free", name: "Qwen QwQ 32B", provider: "Qwen" },
  { id: "qwen/qwen3-30b-a3b:free", name: "Qwen 3 30B", provider: "Qwen" },
  { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout", provider: "Meta" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1", provider: "DeepSeek" },
]

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const selectedModel = models.find((model) => model.id === value)

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="border-0 shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0">
        <SelectValue>
          {selectedModel ? (
            <span className="text-sm text-muted-foreground">{selectedModel.name}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Wybierz model</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span>{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.provider}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

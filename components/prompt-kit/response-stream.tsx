"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Markdown } from "@/components/prompt-kit/markdown"

interface ResponseStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  textStream: string
  reasoning?: string
  mode?: "typewriter" | "instant"
  speed?: number
  onComplete?: () => void
  as?: React.ElementType
  markdown?: boolean
}

const ResponseStream = React.forwardRef<HTMLDivElement, ResponseStreamProps>(
  (
    {
      className,
      textStream,
      reasoning,
      mode = "typewriter",
      speed = 20,
      onComplete,
      as: Component = "div",
      markdown = false,
      ...props
    },
    ref,
  ) => {
    const [displayedText, setDisplayedText] = React.useState("")
    const [isComplete, setIsComplete] = React.useState(false)
    const [showReasoning, setShowReasoning] = React.useState(false)
    const [thinking, setThinking] = React.useState<string | null>(null)
    const [cleanedText, setCleanedText] = React.useState("")

    React.useEffect(() => {
      // Extract thinking from the main text stream
      const thinkMatch = textStream.match(/<think>(.*?)<\/think>/s)
      if (thinkMatch) {
        setThinking(thinkMatch[1].trim())
        // Remove think tags from the main text
        setCleanedText(textStream.replace(/<think>.*?<\/think>/s, "").trim())
      } else {
        setThinking(null)
        setCleanedText(textStream)
      }
    }, [textStream])

    React.useEffect(() => {
      if (mode === "instant") {
        setDisplayedText(cleanedText)
        setIsComplete(true)
        onComplete?.()
        return
      }

      setDisplayedText("")
      setIsComplete(false)
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex < cleanedText.length) {
          setDisplayedText(cleanedText.slice(0, currentIndex + 1))
          currentIndex++
          // Call onComplete during typing for continuous scroll
          onComplete?.()
        } else {
          setIsComplete(true)
          onComplete?.()
          clearInterval(interval)
        }
      }, speed)

      return () => clearInterval(interval)
    }, [cleanedText, mode, speed, onComplete])

    const hasReasoning = thinking || reasoning

    return (
      <Component ref={ref} className={cn(className)} {...props}>
        {hasReasoning && (
          <div className="mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReasoning(!showReasoning)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {showReasoning ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Reasoning
            </Button>
            {showReasoning && (
              <div>
                {thinking && (
                  <div className="mt-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground border-l-2 border-muted-foreground/20">
                    <strong>Thinking:</strong> {thinking}
                  </div>
                )}
                {reasoning && (
                  <div className="mt-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground border-l-2 border-muted-foreground/20">
                    {reasoning}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {markdown ? (
          <Markdown className="prose prose-sm max-w-none">{displayedText}</Markdown>
        ) : (
          <>
            {displayedText}
            {mode === "typewriter" && !isComplete && <span className="animate-pulse">|</span>}
          </>
        )}
      </Component>
    )
  },
)
ResponseStream.displayName = "ResponseStream"

export { ResponseStream }

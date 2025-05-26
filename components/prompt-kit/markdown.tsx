"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string
}

const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("prose prose-sm max-w-none", className)} {...props}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-medium mb-2 mt-3">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-medium mb-1 mt-2">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-medium mb-1 mt-2">{children}</h6>,
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-3">
                <code className={cn("text-sm font-mono", className)} {...props}>
                  {children}
                </code>
              </pre>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic mb-3">{children}</blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
})
Markdown.displayName = "Markdown"

export { Markdown }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page() {
  const [messages, setMessages] = useState<{text: string, sender: "user" | "bot"}[]>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages(prev => [...prev, {
      text: input,
      sender: "user"
    }])
    setInput("")
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-logo.svg" alt="Logo" />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <h1 className="font-semibold">UI Template</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="container h-full max-w-screen-2xl px-4 py-6">
          <Card className="flex h-[calc(100vh-8rem)] flex-col gap-4 p-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarImage 
                        src={message.sender === "user" ? "/placeholder-user.jpg" : "/placeholder-logo.svg"} 
                        alt={message.sender} 
                      />
                      <AvatarFallback>{message.sender === "user" ? "U" : "B"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
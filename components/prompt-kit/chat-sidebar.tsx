"use client"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { PlusIcon, Search } from "lucide-react"

// Conversation history data
const conversationHistory = [
  {
    period: "Today",
    conversations: [
      {
        id: "t1",
        title: "Project roadmap discussion",
        lastMessage: "Let's prioritize the authentication features for the next sprint.",
        timestamp: new Date().setHours(new Date().getHours() - 2),
      },
      {
        id: "t2",
        title: "API Documentation Review",
        lastMessage: "The endpoint descriptions need more detail about rate limiting.",
        timestamp: new Date().setHours(new Date().getHours() - 5),
      },
      {
        id: "t3",
        title: "Frontend Bug Analysis",
        lastMessage: "I found the issue - we need to handle the null state in the user profile component.",
        timestamp: new Date().setHours(new Date().getHours() - 8),
      },
    ],
  },
  {
    period: "Yesterday",
    conversations: [
      {
        id: "y1",
        title: "Database Schema Design",
        lastMessage: "Let's add indexes to improve query performance on these tables.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y2",
        title: "Performance Optimization",
        lastMessage: "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
    ],
  },
  {
    period: "Last 7 days",
    conversations: [
      {
        id: "w1",
        title: "Authentication Flow",
        lastMessage: "We should implement the OAuth2 flow with refresh tokens.",
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: "w2",
        title: "Component Library",
        lastMessage: "These new UI components follow the design system guidelines perfectly.",
        timestamp: new Date().setDate(new Date().getDate() - 5),
      },
      {
        id: "w3",
        title: "UI/UX Feedback",
        lastMessage: "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 6),
      },
    ],
  },
  {
    period: "Last month",
    conversations: [
      {
        id: "m1",
        title: "Initial Project Setup",
        lastMessage: "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 15),
      },
    ],
  },
]

interface ChatSidebarProps {
  onNewChat?: () => void
  onSelectConversation?: (conversationId: string) => void
  currentConversationId?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function ChatSidebar({
  onNewChat,
  onSelectConversation,
  currentConversationId,
  isOpen,
  onOpenChange,
}: ChatSidebarProps) {
  return (
    <Sidebar open={isOpen} onOpenChange={onOpenChange}>
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-2 py-4">
        <div className="flex flex-row items-center gap-2 px-2">
          <div className="bg-primary/10 size-8 rounded-md flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">C</span>
          </div>
          <div className="text-md font-medium text-primary tracking-tight">Chat App</div>
        </div>
        <Button variant="ghost" size="icon" className="size-8">
          <Search className="size-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <div className="px-4">
          <Button variant="outline" className="mb-4 flex w-full items-center gap-2" onClick={onNewChat}>
            <PlusIcon className="size-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {conversationHistory.map((group) => (
          <SidebarGroup key={group.period}>
            <SidebarGroupLabel>{group.period}</SidebarGroupLabel>
            <SidebarMenu>
              {group.conversations.map((conversation) => (
                <SidebarMenuButton
                  key={conversation.id}
                  isActive={currentConversationId === conversation.id}
                  onClick={() => {
                    onSelectConversation?.(conversation.id)
                    // Auto-close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      onOpenChange?.(false)
                    }
                  }}
                  className="flex flex-col items-start gap-1 h-auto py-2"
                >
                  <span className="font-medium text-sm truncate w-full text-left">{conversation.title}</span>
                  <span className="text-xs text-muted-foreground truncate w-full text-left">
                    {conversation.lastMessage}
                  </span>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export { ChatSidebar }

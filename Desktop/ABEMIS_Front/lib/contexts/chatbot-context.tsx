'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
}

interface ChatbotContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! I\'m the ABEMIS Assistant. I can help you with information about the Agricultural & Biosystems Engineering Management Information System, project tracking, system features, and general inquiries. How can I assist you today?',
    sender: 'bot',
    timestamp: new Date()
  }
]

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const clearMessages = () => {
    setMessages(initialMessages)
  }

  const value: ChatbotContextType = {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    messages,
    setMessages,
    addMessage,
    clearMessages
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}

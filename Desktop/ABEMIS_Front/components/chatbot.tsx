'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useChatbot } from '@/lib/contexts/chatbot-context'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Loader2,
  Sparkles,
  HelpCircle,
  Search,
  FileText,
  Settings
} from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
}

interface ChatbotProps {
  className?: string
}

const botResponses = {
  greetings: [
    "Hello! Welcome to ABEMIS 3.0. How can I help you today?",
    "Hi there! I'm here to assist you with ABEMIS-related questions.",
    "Good day! What would you like to know about the ABEMIS system?"
  ],
  system_info: [
    "ABEMIS 3.0 is the official information system of the Department of Agriculture - Bureau of Agricultural and Fisheries Engineering (DA-BAFE) Central Office. It manages agricultural infrastructure projects, farm-to-market roads, and engineering initiatives across the Philippines.",
    "The system provides comprehensive tools for project creation, approval workflows, implementation monitoring, and document management for agricultural infrastructure projects."
  ],
  project_tracking: [
    "To track a project, you can use the project tracking section on the landing page. Enter your project code or select from available projects to view real-time status, progress, and milestones.",
    "Project tracking allows you to monitor project progress, view milestones, check budget allocations, and see completion status for agricultural infrastructure projects."
  ],
  features: [
    "ABEMIS 3.0 includes: Project Creation & Planning, Project Approval System, Implementation Monitoring, Farm-to-Market Road Management, Document Management, and Multi-Level Access Control.",
    "Key features include streamlined project creation workflows, digital approval processes, real-time progress tracking, specialized farm-to-market road tools, centralized document storage, and role-based access control."
  ],
  login: [
    "To access the ABEMIS system, click the 'Login' button in the navigation or use the 'Access System' button on the landing page. You'll need authorized credentials to log in.",
    "Authorized personnel can access the system to manage projects, monitor implementations, and coordinate agricultural infrastructure initiatives."
  ],
  default: [
    "I understand you're asking about ABEMIS. Could you be more specific about what you'd like to know? I can help with system information, project tracking, features, or login assistance.",
    "That's an interesting question about ABEMIS. Let me know if you need help with project tracking, system features, or general information about the agricultural engineering management system.",
    "I'm here to help with ABEMIS-related questions. Feel free to ask about project management, system capabilities, or how to get started with the platform."
  ]
}

export function Chatbot({ className = '' }: ChatbotProps) {
  const { 
    isOpen, 
    setIsOpen, 
    isMinimized, 
    setIsMinimized, 
    messages, 
    addMessage 
  } = useChatbot()
  
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)]
    }
    
    if (message.includes('system') || message.includes('abemis') || message.includes('what is')) {
      return botResponses.system_info[Math.floor(Math.random() * botResponses.system_info.length)]
    }
    
    if (message.includes('track') || message.includes('project') || message.includes('status')) {
      return botResponses.project_tracking[Math.floor(Math.random() * botResponses.project_tracking.length)]
    }
    
    if (message.includes('feature') || message.includes('capability') || message.includes('function')) {
      return botResponses.features[Math.floor(Math.random() * botResponses.features.length)]
    }
    
    if (message.includes('login') || message.includes('access') || message.includes('enter')) {
      return botResponses.login[Math.floor(Math.random() * botResponses.login.length)]
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    addMessage(userMessage)
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue.trim()),
        sender: 'bot',
        timestamp: new Date()
      }
      
      addMessage(botResponse)
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const quickActions = [
    { label: "Track Project", icon: Search, action: "How do I track a project?" },
    { label: "System Info", icon: HelpCircle, action: "What is ABEMIS?" },
    { label: "Features", icon: FileText, action: "What features does ABEMIS have?" },
    { label: "Login Help", icon: Settings, action: "How do I login to ABEMIS?" }
  ]

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Floating background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Button
            onClick={toggleChat}
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-primary/25 transition-all duration-500 transform hover:scale-110 group"
            size="icon"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            <MessageCircle className="h-7 w-7 relative z-10 text-white" />
            
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
          </Button>
          
          {/* Enhanced notification badge */}
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-xs text-white font-bold">!</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat with ABEMIS Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-sm shadow-2xl border-0 bg-white/10 backdrop-blur-xl transition-all duration-500 ease-out transform ${
          isMinimized ? 'h-16' : 'h-[520px] sm:h-[520px]'
        } ${isOpen ? 'animate-in slide-in-from-bottom-4 fade-in-0' : 'animate-out slide-out-to-bottom-4 fade-out-0'} rounded-2xl overflow-hidden`}>
          {/* Simplified Header */}
          <div className="p-4 bg-primary border-b border-primary/20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                    {/* Moved the status indicator inside to be fully visible */}
                    <span className="absolute bottom-1 right-1 block w-3 h-3">
                      <span className="absolute inset-0 rounded-full bg-green-400 opacity-70 animate-ping"></span>
                      <span className="relative block w-full h-full rounded-full bg-green-500 border-2 border-white"></span>
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="font-semibold text-base text-white leading-tight truncate">ABEMIS Assistant</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                    <p className="text-xs text-white/90">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMinimize}
                  className="h-8 w-8 bg-white/20 hover:bg-white/30 rounded-full text-white hover:text-white"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-8 w-8 bg-red-500/30 hover:bg-red-500/50 rounded-full text-white hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Actions - Temporarily Hidden */}
              {/* <div className="p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => handleQuickAction(action.action)}
                      className="h-8 text-xs bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center px-2"
                    >
                      <action.icon className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="hidden sm:inline truncate">{action.label}</span>
                      <span className="sm:hidden truncate">{action.label.split(' ')[0]}</span>
                    </Button>
                  ))}
                </div>
              </div> */}

              {/* Messages */}
              <CardContent className="p-0 h-[320px] overflow-y-auto bg-gradient-to-b from-transparent to-primary/5">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] min-w-0 rounded-2xl px-4 py-3 transition-all duration-300 transform hover:scale-105 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg'
                            : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-md border border-white/20'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border border-white/20">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Enhanced Input */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-transparent border-t border-white/20">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about ABEMIS..."
                      className="h-10 sm:h-12 bg-white/80 backdrop-blur-sm border-white/30 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-sm"
                      disabled={isTyping}
                    />
                    {inputValue && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Sparkles className="h-4 w-4 text-primary/60" />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-110 disabled:scale-100 disabled:opacity-50"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" />
                    ) : (
                      <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
                  <p className="text-xs text-gray-600 hidden sm:block flex-1 min-w-0">
                    💡 Try: "How do I track a project?" or "What is ABEMIS?"
                  </p>
                  <p className="text-xs text-gray-600 sm:hidden flex-1 min-w-0">
                    💡 Ask about ABEMIS
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600">Ready</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperAirplaneIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon,
  BookmarkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { GradientText } from '@/components/ui/gradient-text'
import { LoadingSpinner, DotsLoader } from '@/components/ui/loading-spinner'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{
    title: string
    content: string
    confidence: number
  }>
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Q2 Marketing Strategy',
      lastMessage: 'How can we improve our social media engagement?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 12,
    },
    {
      id: '2',
      title: 'Product Roadmap Discussion',
      lastMessage: 'What are the key features for next quarter?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 8,
    },
  ])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [streamingContent, setStreamingContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsStreaming(true)
    setStreamingContent('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Start streaming response
      const response = await simulateStreamingResponse(input.trim())

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources: [
          {
            title: 'Marketing Strategy Document Q2 2024',
            content: 'Our Q2 marketing strategy focuses on social media engagement...',
            confidence: 0.92,
          },
          {
            title: 'Social Media Best Practices',
            content: 'Best practices for improving social media engagement include...',
            confidence: 0.87,
          },
        ],
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingContent('')
    }
  }

  const simulateStreamingResponse = async (query: string): Promise<string> => {
    const responses = [
      "Based on your documents, here are several strategies to improve social media engagement:\n\n1. **Content Strategy**: Focus on creating high-quality, engaging content that resonates with your target audience. Use a mix of educational, entertaining, and promotional content.\n\n2. **Posting Schedule**: Maintain a consistent posting schedule and post during peak engagement hours for your audience.\n\n3. **Engagement Tactics**: Respond to comments promptly, ask questions to encourage interaction, and use interactive features like polls and stories.\n\n4. **Hashtag Strategy**: Use relevant hashtags strategically to increase visibility and reach new audiences.\n\nWould you like me to elaborate on any of these strategies or help you create a specific content calendar?",
    ]

    const response = responses[0]
    let content = ''

    for (let i = 0; i < response.length; i++) {
      content += response[i]
      setStreamingContent(content)
      await new Promise(resolve => setTimeout(resolve, 20))
    }

    return content
  }

  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInput('')
    inputRef.current?.focus()
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id)
    // TODO: Load conversation messages
    setMessages([
      {
        id: '1',
        role: 'user',
        content: conversation.lastMessage,
        timestamp: conversation.timestamp,
      },
      {
        id: '2',
        role: 'assistant',
        content: 'I found some great information in your documents that addresses this question. Let me help you with that.',
        timestamp: new Date(conversation.timestamp.getTime() + 1000),
      },
    ])
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Conversations</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>

              <Button
                onClick={handleNewConversation}
                className="w-full h-10 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    currentConversationId === conversation.id
                      ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{conversation.messageCount} messages</span>
                        <span>{conversation.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Delete conversation
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="w-6 h-6" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  <GradientText>AI Knowledge Assistant</GradientText>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask questions about your documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BookmarkIcon className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to InsightIQ
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Start a conversation with your AI assistant. Ask questions about your documents, request summaries, or get insights from your knowledge base.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Card className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors cursor-pointer">
                    <DocumentTextIcon className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Analyze Documents</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ask questions about your uploaded documents</p>
                  </Card>
                  <Card className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors cursor-pointer">
                    <CpuChipIcon className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Get Insights</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive AI-powered analysis and recommendations</p>
                  </Card>
                  <Card className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors cursor-pointer">
                    <SparklesIcon className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Generate Content</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Create summaries and extract key information</p>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <CpuChipIcon className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className={`max-w-3xl ${message.role === 'user' ? 'order-1' : ''}`}>
                        <Card className={`p-4 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white border-0 shadow-lg'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-soft'
                        }`}>
                          <CardContent className="p-0">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>

                            {message.sources && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                  Sources
                                </h4>
                                <div className="space-y-2">
                                  {message.sources.map((source, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                          {source.title}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {Math.round(source.confidence * 100)}% confidence
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {source.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.role === 'assistant' && (
                            <>
                              <Button variant="ghost" size="sm">
                                👍 Helpful
                              </Button>
                              <Button variant="ghost" size="sm">
                                📝 Edit
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Streaming Message */}
                {isStreaming && streamingContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <CpuChipIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-3xl">
                      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-soft">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <p className="whitespace-pre-wrap">{streamingContent}</p>
                            </div>
                            <DotsLoader size="sm" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {/* Loading State */}
                {isLoading && !isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <CpuChipIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-3xl">
                      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-soft">
                        <CardContent className="p-4">
                          <LoadingSpinner size="sm" />
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your documents..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white"
                  rows={1}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-2 w-8 h-8 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-xl"
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" variant="white" />
                  ) : (
                    <PaperAirplaneIcon className="w-4 h-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>AI can make mistakes. Verify important information.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
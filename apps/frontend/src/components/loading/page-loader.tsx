'use client'

import { motion } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner, DotsLoader } from '@/components/ui/loading-spinner'
import { Card } from '@/components/ui/card'

interface PageLoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  fullScreen?: boolean
}

export function PageLoader({
  message = 'Loading...',
  size = 'md',
  variant = 'spinner',
  fullScreen = false
}: PageLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className={`w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-400 rounded-2xl shadow-xl flex items-center justify-center ${sizeClasses[size]}`}>
          <SparklesIcon className="w-10 h-10 text-white" />
        </div>

        {/* Pulsing ring effect */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-400 rounded-2xl opacity-20 animate-ping" />
      </motion.div>

      {/* Loading indicator */}
      <div className="flex flex-col items-center space-y-2">
        {variant === 'spinner' && (
          <LoadingSpinner size={size} variant="brand" />
        )}
        {variant === 'dots' && (
          <DotsLoader size={size} />
        )}
        {variant === 'pulse' && (
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`bg-brand-600 rounded-full animate-pulse ${sizeClasses[size]}`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1.4s',
                }}
              />
            ))}
          </div>
        )}

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 text-center max-w-xs"
          >
            {message}
          </motion.p>
        )}
      </div>

      {/* Loading tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center max-w-md space-y-2"
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
            💡 Pro Tip
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Did you know? InsightIQ can process documents in over 10 different formats including PDF, Word, and web pages.
          </p>
        </div>
      </motion.div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%233B82F6\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  )
}

interface SuspenseLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SuspenseLoader({ children, fallback }: SuspenseLoaderProps) {
  return (
    <div className="min-h-screen">
      {children}
      {fallback && <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {fallback}
      </div>}
    </div>
  )
}

// Specialized loaders for different contexts
export function DocumentProcessingLoader() {
  return (
    <PageLoader
      message="Processing your document..."
      variant="dots"
      fullScreen
    />
  )
}

export function ChatLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <LoadingSpinner size="sm" variant="brand" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">AI is thinking...</span>
      </motion.div>
    </div>
  )
}

export function AuthLoader() {
  return (
    <PageLoader
      message="Authenticating..."
      variant="pulse"
      fullScreen
    />
  )
}

export function DashboardLoader() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
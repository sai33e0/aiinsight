import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'brand' | 'white'
}

const sizeVariants = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const variantStyles = {
  default: 'border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100',
  brand: 'border-gray-200 border-t-brand-600',
  white: 'border-white/20 border-t-white',
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2',
          sizeVariants[size],
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = 'LoadingSpinner'

export const DotsLoader = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const dotSize = {
      sm: 'w-1 h-1',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    }

    return (
      <div ref={ref} className={cn('flex items-center gap-1', className)} {...props}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'bg-current rounded-full animate-bounce',
              dotSize[size]
            )}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
    )
  }
)
DotsLoader.displayName = 'DotsLoader'

export const PulseLoader = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-2',
          className
        )}
        {...props}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'bg-brand-600 rounded-full animate-pulse',
              sizeVariants[size]
            )}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1.4s',
            }}
          />
        ))}
      </div>
    )
  }
)
PulseLoader.displayName = 'PulseLoader'
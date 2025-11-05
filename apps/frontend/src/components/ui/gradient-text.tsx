import * as React from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'rainbow'
}

const gradientVariants = {
  brand: 'from-brand-600 to-brand-400',
  success: 'from-green-600 to-emerald-400',
  warning: 'from-yellow-600 to-orange-400',
  error: 'from-red-600 to-pink-400',
  rainbow: 'from-purple-600 via-pink-500 to-orange-400',
}

export const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, variant = 'brand', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'bg-gradient-to-r bg-clip-text text-transparent font-semibold',
          gradientVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
GradientText.displayName = 'GradientText'
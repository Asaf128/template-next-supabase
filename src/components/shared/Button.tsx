import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-foreground text-text-on-dark hover:bg-surface-dark shadow-lg hover:shadow-xl',
  secondary: 'bg-surface text-foreground hover:bg-surface-2 border-border border',
  ghost: 'text-foreground hover:text-text-secondary bg-transparent',
  accent: 'bg-accent text-text-on-dark hover:bg-accent-dark',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        'cursor-pointer font-medium tracking-[0.15em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
}

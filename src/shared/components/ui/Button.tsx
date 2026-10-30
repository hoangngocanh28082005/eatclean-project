import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'variant'> {
  variant?: Variant
  size?: Size
  to?: string
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-forest-700 text-white hover:bg-forest-600 shadow-sm hover:shadow-md focus-visible:outline-forest-700',
  secondary:
    'bg-accent-500 text-forest-900 hover:bg-accent-400 shadow-sm hover:shadow-md focus-visible:outline-accent-600',
  outline:
    'border border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white focus-visible:outline-forest-700',
  ghost:
    'text-forest-700 hover:bg-sage-100 focus-visible:outline-forest-700',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', to, className = '', children, ...rest },
  ref,
) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  )
})

export default Button

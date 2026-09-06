import { cn } from '@/shared/utils/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

/**
 * Jediné tlačítko systému. `accent` smí být na obrazovce jedno.
 * `phone` sází telefon s tabulárními číslicemi — vždy pro tel: odkazy.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent text-[15px] font-semibold leading-none transition-[color,background-color,border-color] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
        ink: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border-input bg-transparent text-foreground hover:border-foreground/40',
        quiet: 'bg-transparent text-accent hover:text-accent-hover px-1 min-h-8',
        onSlab: 'bg-slab-foreground text-slab hover:bg-slab-foreground/90',
        onSlabOutline: 'border-slab-line bg-transparent text-slab-foreground hover:border-slab-foreground/60',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-secondary',
      },
      size: {
        clear: '',
        sm: 'min-h-[38px] px-3.5 text-sm',
        default: 'min-h-11 px-5',
        lg: 'min-h-[52px] px-[26px] text-base',
        icon: 'size-11',
      },
      phone: {
        true: 'font-medium tabular-nums',
        false: '',
      },
      full: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'default',
      phone: false,
      full: false,
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, phone, full, ...props }) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, phone, full, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

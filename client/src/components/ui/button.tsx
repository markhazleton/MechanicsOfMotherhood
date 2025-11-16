import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        // Primary terracotta action
        default: "bg-primary text-primary-foreground hover:bg-accent-700 active:bg-accent-800",
        // Warm brand variant
        brand: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
        // Terracotta accent (main CTA)
        accent: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700",
        // Subtle warm variant
        subtle: "bg-warm-peach text-brand-800 hover:bg-accent-100 border border-warm-peach shadow-sm",
        // Outline variants
        outline: "border-2 border-input bg-background hover:bg-warm-peach hover:text-accent-foreground hover:border-accent-300",
        outlineBrand: "border-2 border-brand-500 text-brand-700 hover:bg-brand-50 hover:border-brand-600 dark:hover:bg-brand-900/30",
        // Utility variants
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-warm-peach hover:text-accent-700 shadow-none",
        link: "text-accent-600 underline-offset-4 hover:underline shadow-none hover:text-accent-700",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Make Bold button: confident, modest radius, quick no-bounce transitions,
// darken on hover and a 1px nudge on press.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent font-sans font-semibold leading-none tracking-[0.01em] transition-[background-color,color,border-color,transform] duration-[120ms] ease-standard active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Rust primary action
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        brand: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // Ember accent
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
        // Rust outline (Make Bold "secondary")
        outlineBrand: "border-primary bg-transparent text-primary-ink hover:bg-primary-soft",
        // Neutral outline on card surface
        outline: "border-border bg-card text-foreground hover:border-neutral-300 hover:bg-muted dark:hover:border-neutral-600",
        // Soft rust tint
        subtle: "bg-primary-soft text-primary-ink hover:bg-brand-100 dark:hover:bg-brand-800",
        // Ink / dark surface
        dark: "bg-neutral-900 text-cream hover:bg-neutral-800 dark:bg-cream dark:text-neutral-900 dark:hover:bg-neutral-100",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90 dark:text-neutral-900",
        secondary: "bg-secondary text-secondary-foreground hover:bg-neutral-200 dark:hover:bg-neutral-600",
        ghost: "bg-transparent text-foreground hover:bg-secondary",
        link: "h-auto border-0 px-0 text-link underline-offset-4 hover:text-link-hover hover:underline active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 text-[15px]",
        sm: "h-9 px-3.5 text-sm",
        lg: "h-12 px-7 text-[17px] [&_svg]:size-[18px]",
        icon: "size-10",
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

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }

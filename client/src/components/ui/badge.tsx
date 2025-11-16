import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        // Terracotta primary
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-accent-700",
        // Warm brand variant
        brand: "border-transparent bg-brand-600 text-white hover:bg-brand-700",
        // Terracotta accent
        accent: "border-transparent bg-accent-500 text-white hover:bg-accent-600",
        // Subtle warm variant
        subtle: "bg-warm-peach text-brand-800 border-brand-200 hover:bg-accent-100",
        // Outline with warm tones
        outline: "text-brand-700 border-brand-300 hover:bg-warm-peach",
        // Utility variants
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

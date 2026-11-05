import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Make Bold badge: compact label, 4px radius, muted tones.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border border-transparent px-2.5 py-[5px] font-sans text-xs font-semibold leading-none tracking-[0.02em]",
  {
    variants: {
      variant: {
        default: "bg-primary-soft text-primary-ink",
        brand: "bg-primary-soft text-primary-ink",
        accent: "bg-accent-soft text-accent-ink",
        subtle: "bg-secondary text-secondary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-secondary-foreground",
        solid: "bg-primary text-primary-foreground",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        info: "bg-info-soft text-info",
        destructive: "bg-destructive-soft text-destructive",
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

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        // Classic gradient button with shimmer effect
        default:
          "bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] rounded-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",

        // Destructive with pulsing glow
        destructive:
          "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-500/60 hover:scale-[1.02] rounded-lg backdrop-blur-sm border border-red-400/30 hover:border-red-300/50",

        // Premium glass outline button
        outline:
          "border-2 border-primary/30 bg-background/60 backdrop-blur-md shadow-sm hover:bg-primary/5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 rounded-lg hover:-translate-y-0.5",

        // Soft secondary with gradient
        secondary:
          "bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg hover:scale-[1.02] rounded-lg border border-secondary/20",

        // Ghost with smooth glow effect
        ghost:
          "hover:bg-accent/80 hover:text-accent-foreground rounded-lg hover:shadow-md hover:shadow-accent/20 backdrop-blur-sm",

        // Animated link button
        link:
          "text-primary underline-offset-4 hover:underline decoration-2 decoration-primary/40 hover:decoration-primary transition-all",

        // Neon glow button
        neon:
          "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 hover:scale-105 rounded-full border border-cyan-300/50 animate-pulse hover:animate-none font-semibold",

        // Glassmorphic button
        glass:
          "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-foreground shadow-lg hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/40 hover:shadow-xl hover:scale-[1.02] rounded-xl",

        // Success button with emerald gradient
        success:
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/60 hover:scale-[1.02] rounded-lg border border-emerald-400/50",

        // Premium gold button
        premium:
          "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-amber-950 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 hover:scale-105 rounded-lg font-bold border border-amber-300/60 bg-size-200 hover:bg-pos-100",

        // 3D raised button
        raised:
          "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0_6px_0_0_hsl(var(--primary)/0.6)] hover:shadow-[0_4px_0_0_hsl(var(--primary)/0.6)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_hsl(var(--primary)/0.6)] active:translate-y-[4px] rounded-lg",

        // Gradient animated button
        animated:
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105 rounded-lg bg-size-200 animate-gradient",

        // Dark mode optimized button
        dark:
          "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-900/70 border border-slate-700 hover:border-slate-600 rounded-lg hover:scale-[1.02]",

        // Soft pastel button
        soft:
          "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-900 dark:text-rose-100 shadow-md hover:shadow-lg hover:shadow-rose-200/50 dark:hover:shadow-rose-500/20 border border-rose-200 dark:border-rose-500/30 rounded-xl hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-5 py-2 min-w-[100px]",
        sm: "h-8 rounded-md px-3 text-xs min-w-[80px]",
        lg: "h-12 rounded-lg px-8 text-base min-w-[120px]",
        xl: "h-14 rounded-xl px-10 text-lg min-w-[140px]",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
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

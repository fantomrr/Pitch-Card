import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { forwardRef } from "react"

const headingVariants = cva("font-bold leading-tight tracking-tighter", {
  variants: {
    size: {
      default: "text-3xl md:text-4xl",
      sm: "text-2xl md:text-3xl",
      lg: "text-4xl md:text-5xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({ className, size, children, ...props }, ref) => {
  return (
    <h1 ref={ref} {...props} className={cn(headingVariants({ size, className }))}>
      {children}
    </h1>
  )
})
Heading.displayName = "Heading"

export { Heading, headingVariants }


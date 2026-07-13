import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "../../utils/format"

type CardProps = ComponentPropsWithoutRef<"div"> & {
  padding?: "none" | "md" | "lg"
}

const paddingClass = {
  none: "",
  md: "p-6",
  lg: "p-8",
}

export const Card = ({ padding = "none", className, children, ...props }: CardProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-[20px] border border-gray-200/80 bg-surface-elevated shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(12,107,61,0.06)]",
      paddingClass[padding],
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

type CardHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
}

export const CardHeader = ({ title, description, action }: CardHeaderProps) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
    <div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
    </div>
    {action}
  </div>
)

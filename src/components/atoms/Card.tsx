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
      "overflow-hidden rounded-[20px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(4,104,50,0.08)]",
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
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {action}
  </div>
)

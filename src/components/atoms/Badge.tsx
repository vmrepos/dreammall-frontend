import type { ComponentPropsWithoutRef } from "react"

const variants = {
  default: "bg-gray-100 text-ink-muted",
  brand: "bg-brand-light text-brand",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-sky-100 text-sky-800",
  success: "bg-brand-light text-brand",
  danger: "bg-red-100 text-red-700",
} as const

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: keyof typeof variants
}

export const Badge = ({ variant = "default", className, ...props }: BadgeProps) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      variants[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  />
)

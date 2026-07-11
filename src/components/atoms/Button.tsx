import type { ComponentPropsWithoutRef } from "react"
import { cn } from "../../utils/format"

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-65",
  secondary:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-65",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-65",
  ghost: "text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-65",
} as const

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: keyof typeof variants
}

export const Button = ({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99]",
      variants[variant],
      className,
    )}
    {...props}
  />
)

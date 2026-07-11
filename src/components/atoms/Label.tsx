import type { ComponentPropsWithoutRef } from "react"

type LabelProps = ComponentPropsWithoutRef<"label">

export const Label = ({ className, ...props }: LabelProps) => (
  <label
    className={["text-sm font-semibold text-gray-900", className].filter(Boolean).join(" ")}
    {...props}
  />
)

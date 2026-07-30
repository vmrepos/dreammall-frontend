import { forwardRef, type ComponentPropsWithoutRef } from "react"

export const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-surface-elevated py-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-4 focus:ring-brand-muted"

type InputProps = ComponentPropsWithoutRef<"input"> & {
  hasIcon?: boolean
  hasTrailingIcon?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasIcon = false, hasTrailingIcon = false, ...props }, ref,
) {
  const paddingClass = [
    hasIcon ? "pl-11" : "pl-3.5",
    hasTrailingIcon ? "pr-11" : "pr-3.5",
  ].join(" ")

  return (
    <input
      ref={ref}
      className={[inputClassName, paddingClass, className].filter(Boolean).join(" ")}
      {...props}
    />
  )
})


import { cn } from "../../utils/format"

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition",
      checked ? "bg-brand" : "bg-gray-200",
    )}
  >
    <span
      className={cn(
        "inline-block size-5 rounded-full bg-white shadow transition",
        checked ? "translate-x-6" : "translate-x-1",
      )}
    />
  </button>
)

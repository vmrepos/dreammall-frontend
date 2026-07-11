import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import type { ComponentPropsWithoutRef } from "react"
import { Input } from "../atoms/Input"
import { Label } from "../atoms/Label"

type FormFieldProps = {
  id: string
  label: string
  icon?: IconDefinition
} & Omit<ComponentPropsWithoutRef<typeof Input>, "id">

export const FormField = ({ id, label, icon, ...inputProps }: FormFieldProps) => (
  <div className="flex flex-col gap-2 text-left">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-brand"
          aria-hidden
        />
      )}
      <Input id={id} hasIcon={Boolean(icon)} {...inputProps} />
    </div>
  </div>
)

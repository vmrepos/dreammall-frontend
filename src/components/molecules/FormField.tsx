import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { useState, type ComponentPropsWithoutRef } from "react"
import { Input } from "../atoms/Input"
import { Label } from "../atoms/Label"

type FormFieldProps = {
  id: string
  label: string
  icon?: IconDefinition
} & Omit<ComponentPropsWithoutRef<typeof Input>, "id" | "hasIcon" | "hasTrailingIcon">

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

type PasswordFieldProps = Omit<FormFieldProps, "type">

export const PasswordField = ({ id, label, icon, ...inputProps }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false)

  return (
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
        <Input
          id={id}
          type={visible ? "text" : "password"}
          hasIcon={Boolean(icon)}
          hasTrailingIcon
          {...inputProps}
        />
        <button
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-brand"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <FontAwesomeIcon
            icon={visible ? faEyeSlash : faEye}
            className="size-[18px]"
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}

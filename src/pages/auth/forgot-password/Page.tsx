import { faEnvelope, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { BrandLogo } from "../../../components/atoms/BrandLogo"
import { FormField } from "../../../components/molecules/FormField"
import { useState } from "react"
import { authService } from "../../../services/authService"

export const Page = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      setError("No se pudo enviar el correo. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-8 py-8">
      <div className="w-full max-w-md rounded-[20px] border border-gray-200/80 bg-surface-elevated p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(12,107,61,0.06)]">
        <header className="mb-8">
          <div className="mb-4">
            <BrandLogo className="h-14" />
            <p className="mt-2 text-[13px] font-semibold text-brand">Comercio</p>
          </div>
          <h1 className="mb-2 text-[1.75rem] font-bold leading-tight text-brand">
            Recuperar contraseña
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            Te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </header>

        {sent ? (
          <div className="rounded-xl bg-brand-light px-4 py-3.5 text-sm leading-relaxed text-ink">
            Si el correo existe, enviamos un enlace para restablecer la contraseña. Revisa tu bandeja
            de entrada.
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormField
              id="email"
              label="Correo electrónico"
              icon={faEnvelope}
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />

            {error && (
              <div
                className="rounded-xl bg-red-50 px-4 py-3.5 text-left text-sm leading-snug text-red-600"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}

        <div className="mt-6 flex gap-3 rounded-xl bg-brand-light p-4 text-left">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="mt-0.5 size-5 shrink-0 text-brand"
            aria-hidden
          />
          <div>
            <p className="mb-1 text-sm font-bold text-brand">Importante</p>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              El enlace expira en 30 minutos. Si no pediste este cambio, ignora el correo.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-muted">
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

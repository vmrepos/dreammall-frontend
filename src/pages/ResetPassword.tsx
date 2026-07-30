import { faLock, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BrandMark } from "../components/atoms/BrandMark"
import { PasswordField } from "../components/molecules/FormField"
import { useState } from "react"
import { authService } from "../services/authService"
import axios from "axios"

export const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setError(null)

    if (!token) {
      setError("El enlace no es válido. Solicita uno nuevo.")
      return
    }

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setIsSubmitting(true)
    try {
      await authService.resetPassword(token, password, passwordConfirmation)
      navigate("/login", { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error
        if (typeof message === "string") {
          setError(message)
          return
        }
        if (Array.isArray(message)) {
          setError(message.join(", "))
          return
        }
      }
      setError("No se pudo actualizar la contraseña. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-8 py-8">
      <div className="w-full max-w-md rounded-[20px] border border-gray-200/80 bg-surface-elevated p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(12,107,61,0.06)]">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-semibold text-brand">
              Dream Mall · Comercio
            </span>
            <BrandMark />
          </div>
          <h1 className="mb-2 text-[1.75rem] font-bold leading-tight text-brand">
            Nueva contraseña
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            Elige una contraseña nueva para tu cuenta.
          </p>
        </header>

        {!token ? (
          <div className="rounded-xl bg-red-50 px-4 py-3.5 text-sm text-red-600" role="alert">
            Falta el token del enlace. Solicita un nuevo correo de recuperación.
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <PasswordField
              id="password"
              label="Nueva contraseña"
              icon={faLock}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              minLength={6}
            />
            <PasswordField
              id="password_confirmation"
              label="Confirmar contraseña"
              icon={faLock}
              autoComplete="new-password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(ev) => setPasswordConfirmation(ev.target.value)}
              required
              minLength={6}
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
              {isSubmitting ? "Guardando..." : "Guardar contraseña"}
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
              Después de guardar, inicia sesión con tu nueva contraseña.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-muted">
          <Link to="/forgot-password" className="font-semibold text-brand hover:underline">
            Solicitar un nuevo enlace
          </Link>
        </p>
      </div>
    </div>
  )
}

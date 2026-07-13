import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"
import { BrandMark } from "../components/atoms/BrandMark"
import { FormField } from "../components/molecules/FormField"
import { useAuth } from "../context/AuthContext"

export const Login = () => {
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate("/", { replace: true })
    } catch {
      setError("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.")
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
            Iniciar sesión
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            Accede a tu panel de comercio
          </p>
        </header>

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

          <FormField
            id="password"
            label="Contraseña"
            icon={faLock}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
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
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 flex gap-3 rounded-xl bg-brand-light p-4 text-left">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="mt-0.5 size-5 shrink-0 text-brand"
            aria-hidden
          />
          <div>
            <p className="mb-1 text-sm font-bold text-brand">Importante</p>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              Solo usuarios registrados como comercio pueden acceder a este panel.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-muted">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

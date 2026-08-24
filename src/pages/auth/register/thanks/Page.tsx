import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { BrandLogo } from "../../../../components/atoms/BrandLogo"

type ThanksLocationState = {
  email?: string
  restaurantName?: string
}

export const Page = () => {
  const location = useLocation()
  const state = (location.state ?? {}) as ThanksLocationState
  const email = state.email?.trim()
  const restaurantName = state.restaurantName?.trim()

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-8 py-8">
      <div className="w-full max-w-md rounded-[20px] border border-gray-200/80 bg-surface-elevated p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(12,107,61,0.06)]">
        <header className="mb-8 text-center">
          <div className="mb-4 flex flex-col items-center">
            <BrandLogo className="h-14" />
            <p className="mt-2 text-[13px] font-semibold text-brand">Comercio</p>
          </div>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-light text-brand">
            <FontAwesomeIcon icon={faCircleCheck} className="size-7" aria-hidden />
          </div>
          <h1 className="mb-2 text-[1.75rem] font-bold leading-tight text-brand">
            ¡Registro recibido!
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {restaurantName
              ? `Recibimos la solicitud de ${restaurantName}.`
              : "Recibimos la solicitud de tu comercio."}{" "}
            Aún no puedes iniciar sesión.
          </p>
        </header>

        <div className="mb-6 space-y-3 rounded-xl bg-brand-light px-4 py-3.5 text-sm leading-relaxed text-ink">
          <p className="font-semibold text-brand">Tu cuenta necesita activación</p>
          <p>
            Un asesor de Pedi2 revisará los datos
            {email ? (
              <>
                {" "}
                de <span className="font-medium">{email}</span>
              </>
            ) : null}{" "}
            y te contactará para activar el acceso después de cerrar el contrato.
          </p>
          <p className="text-ink-muted">
            Mientras tanto, no intentes entrar al panel: solo los comercios activados
            pueden iniciar sesión.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark active:scale-[0.99]"
          >
            Ir al inicio de sesión
          </Link>
          <p className="text-center text-xs leading-relaxed text-ink-muted">
            Cuando tu cuenta esté activa, usa el mismo correo y contraseña que
            registraste.
          </p>
        </div>
      </div>
    </div>
  )
}

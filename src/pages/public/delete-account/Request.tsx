import { Link } from "react-router-dom"
import { SUPPORT_EMAIL, deleteAccountMailto } from "../shared/contact"

export const Request = () => (
  <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
    <p className="text-sm font-semibold text-brand">Pedí2</p>
    <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Eliminar cuenta y datos</h1>
    <p className="mt-2 text-sm text-ink-muted">Solicitud de baja de cuenta</p>

    <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-muted">
      <p>
        Podés pedir que eliminemos tu cuenta Pedí2 y los datos personales asociados. Usá el enlace de abajo
        para enviarnos un correo. Incluí tu nombre, teléfono o correo, y si tu cuenta es de repartidor,
        restaurante o cliente.
      </p>
      <p>
        Algunos datos pueden conservarse cuando la ley lo exige o cuando hace falta para prevenir fraude,
        seguridad, contabilidad, resolver disputas o cumplir acuerdos.
      </p>
      <p>
        También podés escribir a{" "}
        <a className="font-medium text-brand hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </div>

    <a
      href={deleteAccountMailto()}
      className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark active:scale-[0.99] md:w-auto"
    >
      Solicitar eliminación de cuenta
    </a>

    <p className="mt-6 text-sm text-ink-muted">
      Más detalle en la{" "}
      <Link to="/privacy" className="font-medium text-brand hover:underline">
        política de privacidad
      </Link>
      .
    </p>
  </article>
)

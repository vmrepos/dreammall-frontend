import { Link } from "react-router-dom"
import { restaurantPath } from "../../../utils/navigation"

export const CommerceBand = () => (
  <section className="bg-sidebar px-4 py-14 text-white md:px-8 md:py-16">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-accent-sun">Comercios</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          Tu cocina vende. Pedí2 despacha.
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-white/70">
          Pedidos, menú y entregas en un panel. Sin comisión sobre la comida.
        </p>
      </div>
      <div className="flex flex-col gap-3 phone:w-full md:flex-row">
        <Link
          to={restaurantPath("/login")}
          className="inline-flex items-center justify-center rounded-xl bg-accent-sun px-5 py-3.5 text-sm font-semibold text-[#1c241f] transition hover:brightness-110 phone:w-full"
        >
          Acceso comercios
        </Link>
        <Link
          to={restaurantPath("/register")}
          className="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 phone:w-full"
        >
          Registrar mi local
        </Link>
      </div>
    </div>
  </section>
)

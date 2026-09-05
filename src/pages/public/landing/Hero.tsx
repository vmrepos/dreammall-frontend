import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { restaurantPath } from "../../../utils/navigation"
import { cn } from "../../../utils/format"
import { HeroRoute } from "./HeroRoute"

const primaryCtaClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-accent-sun px-5 py-3.5 text-base font-semibold text-[#1c241f] transition hover:brightness-110 active:scale-[0.99]"

const secondaryCtaClass =
  "inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"

export const Hero = () => (
  <section className="relative overflow-hidden px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
    <div
      className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-brand/40 blur-3xl"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-accent-sun/10 blur-3xl"
      aria-hidden
    />
    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-sun">
          Santa Cruz
        </p>
        <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
          De la cocina de tu local, a tu puerta.
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/70 md:text-lg">
          Elegí tu local, armá el pedido y pagá al comercio. Pedí2 asigna el
          repartidor y lleva la bolsa.
        </p>
        <div className="mt-8 flex flex-col gap-3 phone:w-full md:flex-row md:items-center">
          <Link to="/locales" className={cn(primaryCtaClass, "phone:w-full")}>
            Ver locales
            <FontAwesomeIcon icon={faArrowRight} className="size-4" aria-hidden />
          </Link>
          <Link to={restaurantPath("/login")} className={cn(secondaryCtaClass, "phone:w-full")}>
            Acceso comercios
          </Link>
        </div>
      </div>
      <div className="phone:mx-auto phone:w-[min(100%,20rem)]">
        <HeroRoute />
      </div>
    </div>
  </section>
)

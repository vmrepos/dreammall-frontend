import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faMotorcycle, faUtensils } from "@fortawesome/free-solid-svg-icons"

const steps = [
  {
    icon: faUtensils,
    title: "Elegí tu local",
    body: "Mirá el directorio y entrá al menú del comercio.",
  },
  {
    icon: faLocationDot,
    title: "Armá el pedido",
    body: "Productos, pin de entrega y pago al QR del local.",
  },
  {
    icon: faMotorcycle,
    title: "Pedí2 lo lleva",
    body: "Asignamos repartidor y seguimos la bolsa hasta vos.",
  },
]

export const Steps = () => (
  <section className="border-t border-gray-200/80 bg-surface-elevated px-4 py-14 md:px-8 md:py-20">
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Así funciona</h2>
      <p className="mt-2 max-w-lg text-[15px] text-ink-muted">
        Sin app extra. Con el enlace del local, o desde aquí.
      </p>
      <ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <li key={step.title} className="relative">
            <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <FontAwesomeIcon icon={step.icon} className="size-5" aria-hidden />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-sun">
              Paso {index + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

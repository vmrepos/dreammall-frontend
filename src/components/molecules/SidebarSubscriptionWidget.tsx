import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { useSubscription } from "../../context/SubscriptionContext"

export const SidebarSubscriptionWidget = () => {
  const { credits } = useSubscription()

  return (
    <NavLink
      to="/subscription"
      className={({ isActive }) =>
        [
          "block rounded-xl bg-white/5 p-3 transition hover:bg-white/10",
          isActive ? "ring-1 ring-accent-sun/60" : "",
        ].join(" ")
      }
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/45">
        <FontAwesomeIcon icon={faCreditCard} className="size-3.5" aria-hidden />
        Mi suscripción
      </div>
      <p className="text-sm font-semibold text-white">{credits}</p>
      <p className="mt-1 text-xs text-white/50">entregas disponibles</p>
    </NavLink>
  )
}

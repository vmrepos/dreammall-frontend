import { NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../context/AuthContext"
import { useSubscription } from "../../context/SubscriptionContext"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-brand text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
  ].join(" ")

const navItems = [
  { to: "/orders", label: "Pedidos" },
  { to: "/deliveries", label: "Entregas" },
  { to: "/profile", label: "Perfil" },
  { to: "/settings", label: "Configuración" },
  { to: "/menu", label: "Menú" },
] as const

export const Sidebar = () => {
  const { restaurant, logout } = useAuth()
  const { subscription, currentPlan } = useSubscription()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-gray-800 p-4 text-white min-h-svh">
      <h1 className="mb-6 text-lg font-bold">{restaurant?.name ?? "Mi restaurante"}</h1>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-700 pt-4">
        <NavLink
          to="/subscription"
          className={({ isActive }) =>
            [
              "block rounded-xl bg-gray-700/60 p-3 transition hover:bg-gray-700",
              isActive ? "ring-1 ring-brand" : "",
            ].join(" ")
          }
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <FontAwesomeIcon icon={faCreditCard} className="size-3.5" aria-hidden />
            Mi suscripción
          </div>
          {currentPlan ? (
            <>
              <p className="text-sm font-semibold text-white">{currentPlan.name}</p>
              {subscription.creditsRemaining !== null && subscription.creditsTotal !== null ? (
                <p className="mt-1 text-xs text-gray-400">
                  {subscription.creditsRemaining} / {subscription.creditsTotal} entregas
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">Postpago · ilimitado</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">Sin plan activo</p>
          )}
        </NavLink>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
      >
        Cerrar sesión
      </button>
    </aside>
  )
}

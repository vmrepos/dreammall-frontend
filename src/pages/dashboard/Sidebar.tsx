import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

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
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-gray-800 p-4 text-white">
      <h1 className="mb-6 text-lg font-bold">{restaurant?.name ?? "Mi restaurante"}</h1>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

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

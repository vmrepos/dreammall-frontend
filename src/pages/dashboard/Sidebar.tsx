import { NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { BrandLogo } from "../../components/atoms/BrandLogo"
import { Toggle } from "../../components/atoms/Toggle"
import { SidebarSubscriptionWidget } from "../../components/molecules/SidebarSubscriptionWidget"
import { cn } from "../../utils/format"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-brand text-white shadow-sm"
      : "text-white/70 hover:bg-sidebar-hover hover:text-white",
  ].join(" ")

const navItems = [
  { to: "/menu", label: "Menú" },
  { to: "/orders", label: "Pedidos" },
  { to: "/deliveries", label: "Entregas" },
  { to: "/profile", label: "Perfil" },
  { to: "/settings", label: "Configuración" },
  { to: "/reports", label: "Reportes" },
] as const

type Props = {
  open: boolean
  onClose: () => void
}

export const Sidebar = ({ open, onClose }: Props) => {
  const { restaurant, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate("/login", { replace: true })
  }

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity min-[1400px]:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-label="Cerrar menú"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside
        className={cn(
          "relative z-50 flex min-h-svh w-64 shrink-0 flex-col overflow-y-auto bg-sidebar p-4 text-white",
          "max-[1399px]:fixed max-[1399px]:inset-y-0 max-[1399px]:left-0 max-[1399px]:transition-transform max-[1399px]:duration-200",
          open ? "max-[1399px]:translate-x-0" : "max-[1399px]:-translate-x-full",
        )}
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-accent-clay/50 via-accent-sun/40 to-brand/60"
          aria-hidden
        />

        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2">
              <BrandLogo variant="dark" className="h-14 w-[11.5rem]" />
            </div>
            <h1 className="truncate text-sm font-medium text-white/65">
              {restaurant?.name ?? "Mi restaurante"}
            </h1>
          </div>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-sidebar-hover hover:text-white min-[1400px]:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <FontAwesomeIcon icon={faXmark} className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass} onClick={onClose}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <SidebarSubscriptionWidget />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <FontAwesomeIcon
              icon={isDark ? faMoon : faSun}
              className="size-3.5 text-accent-sun"
              aria-hidden
            />
            <span>{isDark ? "Oscuro" : "Claro"}</span>
          </div>
          <Toggle
            checked={isDark}
            label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            onChange={toggleTheme}
          />
        </div>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-white/65 transition hover:bg-sidebar-hover hover:text-white"
        >
          Cerrar sesión
        </button>

        <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 px-1 pt-4">
          <span
            className="inline-flex h-3.5 w-5 shrink-0 flex-col overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
            role="img"
            aria-label="Bandera de Bolivia"
          >
            <span className="h-1/3 w-full bg-[#DA291C]" />
            <span className="h-1/3 w-full bg-[#F4E400]" />
            <span className="h-1/3 w-full bg-[#007A33]" />
          </span>
          <p className="text-[11px] font-medium tracking-wide text-white/40">Hecho en Bolivia</p>
        </div>
      </aside>
    </>
  )
}

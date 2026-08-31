import { NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { BrandLogo } from "../../components/atoms/BrandLogo"
import { Toggle } from "../../components/atoms/Toggle"
import { sidebarNavItems } from "./nav"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-brand text-white shadow-sm"
      : "text-white/70 hover:bg-sidebar-hover hover:text-white",
  ].join(" ")

export const Sidebar = () => {
  const { restaurant, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside className="relative flex min-h-svh w-64 shrink-0 flex-col overflow-y-auto bg-sidebar p-4 text-white phone:hidden">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-accent-clay/50 via-accent-sun/40 to-brand/60"
        aria-hidden
      />

      <div className="mb-6 min-w-0">
        <div className="mb-2">
          <BrandLogo variant="dark" className="h-14 w-[11.5rem]" />
        </div>
        <h1 className="truncate text-sm font-medium text-white/65">
          {restaurant?.name ?? "Mi restaurante"}
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Principal">
        {sidebarNavItems.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2.5">
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
  )
}

import { NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRightFromBracket,
  faChevronLeft,
  faChevronRight,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { BrandLogo } from "../../components/atoms/BrandLogo"
import { Toggle } from "../../components/atoms/Toggle"
import { sidebarNavItems } from "./nav"
import { ImpersonationControls } from "./shared/ImpersonationControls"
import { ShareCatalogButton } from "./shared/ShareCatalogButton"
import { cn } from "../../utils/format"
import { resolveMediaUrl } from "../../utils/mediaUrl"

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const navLinkClass = (isActive: boolean, collapsed: boolean) =>
  cn(
    "flex items-center rounded-lg text-sm font-medium transition",
    collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2",
    isActive
      ? "bg-brand text-white shadow-sm"
      : "text-white/70 hover:bg-sidebar-hover hover:text-white",
  )

export const Sidebar = ({ collapsed, onToggle }: Props) => {
  const { restaurant, isAdmin, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const restaurantLogo = resolveMediaUrl(restaurant?.logo_url)

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside
      className={cn(
        "relative flex min-h-svh shrink-0 flex-col overflow-y-auto bg-sidebar text-white phone:hidden",
        "w-[var(--sidebar-w)] transition-[width] duration-200",
        collapsed ? "p-2" : "p-4",
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-accent-clay/50 via-accent-sun/40 to-brand/60"
        aria-hidden
      />

      <div className={cn("mb-4 flex items-start", collapsed ? "justify-center" : "justify-between gap-2")}>
        {collapsed ? null : (
          <div className="min-w-0">
            <BrandLogo variant="dark" className="mb-2 h-14 w-[11.5rem]" />
            <h1 className="flex items-center gap-2 truncate text-sm font-medium text-white/65">
              {restaurantLogo ? (
                <img
                  src={restaurantLogo}
                  alt=""
                  className="size-6 shrink-0 rounded-md object-cover"
                />
              ) : null}
              <span className="truncate">
                {restaurant?.name ?? (isAdmin ? "Admin" : "Mi restaurante")}
              </span>
            </h1>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Mostrar menú" : "Ocultar menú"}
          title={collapsed ? "Mostrar menú" : "Ocultar menú"}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-sidebar-hover hover:text-white"
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="size-4" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Principal">
        {restaurant
          ? sidebarNavItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) => navLinkClass(isActive, collapsed)}
              >
                <FontAwesomeIcon icon={icon} className="size-3.5 shrink-0 opacity-80" aria-hidden />
                <span className={collapsed ? "sr-only" : ""}>{label}</span>
              </NavLink>
            ))
          : null}
        {restaurant ? (
          <div className={cn("mt-2 border-t border-white/10 pt-2", collapsed && "flex justify-center")}>
            <ShareCatalogButton variant="sidebar" compact={collapsed} />
          </div>
        ) : null}
      </nav>

      {collapsed ? (
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="mt-auto inline-flex size-10 items-center justify-center self-center rounded-lg text-white/70 transition hover:bg-sidebar-hover hover:text-white"
        >
          <FontAwesomeIcon icon={isDark ? faMoon : faSun} className="size-3.5 text-accent-sun" />
        </button>
      ) : (
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
      )}

      <div className={cn("mt-3", collapsed && "flex justify-center")}>
        <ImpersonationControls variant="sidebar" compact={collapsed} />
      </div>

      <button
        type="button"
        onClick={() => void handleLogout()}
        title={collapsed ? "Cerrar sesión" : undefined}
        className={cn(
          "mt-3 rounded-lg text-sm font-medium text-white/65 transition hover:bg-sidebar-hover hover:text-white",
          collapsed
            ? "inline-flex size-10 items-center justify-center self-center"
            : "px-3 py-2 text-left",
        )}
      >
        {collapsed ? (
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="size-3.5" aria-hidden />
        ) : null}
        <span className={collapsed ? "sr-only" : ""}>Cerrar sesión</span>
      </button>

      <div
        className={cn(
          "mt-4 flex items-center border-t border-white/10 pt-4",
          collapsed ? "justify-center px-0" : "gap-2.5 px-1",
        )}
      >
        <span
          className="inline-flex h-3.5 w-5 shrink-0 flex-col overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          role="img"
          aria-label="Bandera de Bolivia"
        >
          <span className="h-1/3 w-full bg-[#DA291C]" />
          <span className="h-1/3 w-full bg-[#F4E400]" />
          <span className="h-1/3 w-full bg-[#007A33]" />
        </span>
        {collapsed ? null : (
          <p className="text-[11px] font-medium tracking-wide text-white/40">Hecho en Bolivia</p>
        )}
      </div>
    </aside>
  )
}

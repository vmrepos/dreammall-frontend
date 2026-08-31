import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRightFromBracket,
  faEllipsis,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { Toggle } from "../../components/atoms/Toggle"
import { cn } from "../../utils/format"
import { isNavActive, moreNavItems, tabNavItems } from "./nav"

const PHONE =
  "(max-width: 767px), ((pointer: coarse) and (max-width: 1023px))"

export const BottomTabs = () => {
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreActive = moreNavItems.some((item) => isNavActive(pathname, item.to))

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 hidden bg-sidebar pb-[env(safe-area-inset-bottom)] phone:block"
        aria-label="Principal"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-clay/50 via-accent-sun/40 to-brand/60"
          aria-hidden
        />
        <ul className="grid h-14 grid-cols-4 px-1.5">
          {tabNavItems.map(({ to, label, icon }) => (
            <li key={to} className="min-w-0">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "mx-0.5 my-1 flex h-[calc(100%-0.5rem)] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-semibold tracking-wide transition",
                    isActive
                      ? "bg-brand text-white shadow-sm"
                      : "text-white/60 hover:bg-sidebar-hover hover:text-white",
                  )
                }
              >
                <FontAwesomeIcon icon={icon} className="size-4" aria-hidden />
                <span className="max-w-full truncate">{label}</span>
              </NavLink>
            </li>
          ))}
          <li className="min-w-0">
            <button
              type="button"
              className={cn(
                "mx-0.5 my-1 flex h-[calc(100%-0.5rem)] w-[calc(100%-0.25rem)] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-semibold tracking-wide transition",
                moreOpen || moreActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-white/60 hover:bg-sidebar-hover hover:text-white",
              )}
              aria-expanded={moreOpen}
              aria-controls="dashboard-more-sheet"
              onClick={() => setMoreOpen((open) => !open)}
            >
              <FontAwesomeIcon icon={faEllipsis} className="size-4" aria-hidden />
              <span>Más</span>
            </button>
          </li>
        </ul>
      </nav>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}

type MoreSheetProps = {
  open: boolean
  onClose: () => void
}

const MoreSheet = ({ open, onClose }: MoreSheetProps) => {
  const { restaurant, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    const phone = window.matchMedia(PHONE)
    const onViewport = () => {
      if (!phone.matches) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    phone.addEventListener("change", onViewport)
    onViewport()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      phone.removeEventListener("change", onViewport)
    }
  }, [open, onClose])

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
          "fixed inset-0 z-[60] hidden bg-black/40 transition-opacity phone:block",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-label="Cerrar menú"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div
        id="dashboard-more-sheet"
        role="dialog"
        aria-labelledby="dashboard-more-title"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] hidden rounded-t-3xl border-t border-gray-200 bg-surface-elevated pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(12,107,61,0.12)] transition-transform duration-200 phone:block",
          open ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
        inert={!open || undefined}
      >
        <div className="flex justify-center pt-3" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <p id="dashboard-more-title" className="truncate px-5 pt-3 text-sm font-medium text-ink-muted">
          {restaurant?.name ?? "Mi restaurante"}
        </p>
        <nav className="mt-2 flex flex-col px-3" aria-label="Más opciones">
          {moreNavItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                  isActive ? "bg-brand-light text-brand" : "text-ink hover:bg-gray-100",
                )
              }
            >
              <FontAwesomeIcon icon={icon} className="size-4 text-brand" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mx-3 mt-2 flex items-center justify-between gap-3 rounded-xl bg-gray-100 px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
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
          className="mx-3 mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-gray-100 hover:text-ink"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="size-4" aria-hidden />
          Cerrar sesión
        </button>
      </div>
    </>
  )
}

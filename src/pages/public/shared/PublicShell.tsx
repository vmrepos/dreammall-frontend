import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { BrandLogo } from "../../../components/atoms/BrandLogo"
import { restaurantPath } from "../../../utils/navigation"
import { cn } from "../../../utils/format"
import { DELETE_ACCOUNT_PATH, SUPPORT_EMAIL } from "./contact"

type Props = {
  children: ReactNode
  tone?: "light" | "dark"
}

export const PublicShell = ({ children, tone = "light" }: Props) => {
  const dark = tone === "dark"

  return (
    <div className={cn("flex min-h-svh flex-col", dark ? "bg-sidebar" : "bg-surface")}>
      <header
        className={cn(
          "sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 md:px-8",
          dark
            ? "bg-sidebar/80 text-white backdrop-blur-md"
            : "border-b border-gray-200/70 bg-surface/85 backdrop-blur-md",
        )}
      >
        <Link to="/" aria-label="Pedi2" className="min-w-0">
          <BrandLogo variant={dark ? "dark" : "auto"} className="h-10 object-left" />
        </Link>
        <Link
          to={restaurantPath("/login")}
          className={cn(
            "shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition",
            dark
              ? "border border-white/25 text-white hover:bg-white/10"
              : "text-brand hover:bg-brand-light",
          )}
        >
          Acceso comercios
        </Link>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <footer
        className={cn(
          "mt-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm md:px-8",
          dark ? "text-white/60" : "border-t border-gray-200/70 text-ink-muted",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/privacy" className={cn("hover:underline", dark ? "text-white/80" : "text-brand")}>
            Privacy Policy
          </Link>
          <Link to={DELETE_ACCOUNT_PATH} className={cn("hover:underline", dark ? "text-white/80" : "text-brand")}>
            Eliminar cuenta
          </Link>
        </div>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className={cn("hover:underline", dark ? "text-white/80" : "hover:text-brand")}
        >
          {SUPPORT_EMAIL}
        </a>
      </footer>
    </div>
  )
}

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faBookOpen,
  faChartPie,
  faClipboardList,
  faGear,
  faTruck,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { DELIVERIES_SECTION_ENABLED } from "./deliveries/Deliveries"

export type TNavItem = {
  to: string
  label: string
  icon: IconDefinition
}

export const sidebarNavItems: TNavItem[] = [
  { to: "/menu", label: "Menú", icon: faBookOpen },
  { to: "/orders", label: "Pedidos", icon: faClipboardList },
  ...(DELIVERIES_SECTION_ENABLED
    ? [{ to: "/deliveries", label: "Entregas", icon: faTruck }]
    : []),
  { to: "/profile", label: "Perfil", icon: faUser },
  { to: "/settings", label: "Configuración", icon: faGear },
  { to: "/reports", label: "Reportes", icon: faChartPie },
]

export const tabNavItems: TNavItem[] = [
  { to: "/orders", label: "Pedidos", icon: faClipboardList },
  { to: "/menu", label: "Menú", icon: faBookOpen },
  ...(DELIVERIES_SECTION_ENABLED
    ? [{ to: "/deliveries", label: "Entregas", icon: faTruck }]
    : [{ to: "/reports", label: "Reportes", icon: faChartPie }]),
]

export const moreNavItems: TNavItem[] = [
  ...(DELIVERIES_SECTION_ENABLED
    ? [{ to: "/reports", label: "Reportes", icon: faChartPie }]
    : []),
  { to: "/profile", label: "Perfil", icon: faUser },
  { to: "/settings", label: "Configuración", icon: faGear },
]

export const isNavActive = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`)

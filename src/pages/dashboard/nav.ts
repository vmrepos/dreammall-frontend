import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faBookOpen,
  faCashRegister,
  faChartPie,
  faClipboardList,
  faGear,
  faTruck,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { restaurantPath } from "../../utils/navigation"
import { DELIVERIES_SECTION_ENABLED } from "./deliveries/Deliveries"

export type TNavItem = {
  to: string
  label: string
  icon: IconDefinition
}

export const sidebarNavItems: TNavItem[] = [
  { to: restaurantPath("/pos"), label: "POS", icon: faCashRegister },
  { to: restaurantPath("/menu"), label: "Menú", icon: faBookOpen },
  { to: restaurantPath("/orders"), label: "Pedidos", icon: faClipboardList },
  ...(DELIVERIES_SECTION_ENABLED
    ? [{ to: restaurantPath("/deliveries"), label: "Entregas", icon: faTruck }]
    : []),
  { to: restaurantPath("/profile"), label: "Perfil", icon: faUser },
  { to: restaurantPath("/settings"), label: "Configuración", icon: faGear },
  { to: restaurantPath("/reports"), label: "Reportes", icon: faChartPie },
]

export const tabNavItems: TNavItem[] = [
  { to: restaurantPath("/pos"), label: "POS", icon: faCashRegister },
  { to: restaurantPath("/orders"), label: "Pedidos", icon: faClipboardList },
  ...(DELIVERIES_SECTION_ENABLED
    ? [{ to: restaurantPath("/deliveries"), label: "Entregas", icon: faTruck }]
    : []),
]

export const moreNavItems: TNavItem[] = [
  { to: restaurantPath("/menu"), label: "Menú", icon: faBookOpen },
  { to: restaurantPath("/reports"), label: "Reportes", icon: faChartPie },
  { to: restaurantPath("/profile"), label: "Perfil", icon: faUser },
  { to: restaurantPath("/settings"), label: "Configuración", icon: faGear },
]

export const isNavActive = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`)

import { Outlet } from "react-router-dom"
import { MenuCatalogProvider } from "../../../context/MenuCatalogContext"

export const MenuLayout = () => (
  <MenuCatalogProvider>
    <Outlet />
  </MenuCatalogProvider>
)

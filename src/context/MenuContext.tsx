import { createContext, useContext } from "react"
import type { TMenu, TMenuForm } from "../types/Menu"
import type { TProduct } from "../types/Product"

type MenuContextType = {
  menus: TMenu[]
  products: TProduct[]
  createMenu: (menu: TMenuForm) => Promise<TMenu>
  updateMenu: (menu: TMenu) => Promise<void>
  deleteMenu: (menu: TMenu) => Promise<void>
  toggleMenu: (menuId: number, active: boolean) => Promise<void>
}

export const MenuContext = createContext<MenuContextType | null>(null)

export const useMenuContext = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider")
  }
  return context
}

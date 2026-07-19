import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { TMenu, TMenuForm } from "../types/Menu"
import type { TProduct } from "../types/Product"
import { apiClient } from "../services/apiClient"
import { ProductList } from "../utils/utils"

type MenuContextType = {
  menus: TMenu[]
  products: TProduct[]
  createMenu: (menu: TMenuForm) => Promise<TMenu>
  updateMenu: (menu: TMenu) => Promise<void>
  deleteMenu: (menu: TMenu) => Promise<void>
  toggleMenu: (menuId: number, active: boolean) => Promise<void>
}

const MenuContext = createContext<MenuContextType | null>(null)

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menus, setMenus] = useState<TMenu[]>([])

  const products = useMemo(() => ProductList(menus), [menus])

  const fetchMenus = async () => {
    try {
      const response = await apiClient.menus.list()
      setMenus(response)
    } catch (error) {
      console.error(error)
    }
  }

  const createMenu = async (menu: TMenuForm) => {
    const response = await apiClient.menus.create(menu)
    setMenus((current) => [...current, response])
    return response
  }

  const updateMenu = async (menu: TMenu) => {
    try {
      const response = await apiClient.menus.update(menu.id, menu)
      setMenus((current) => current.map((m) => (m.id === menu.id ? response : m)))
    } catch (error) {
      console.error(error)
    }
  }

  const deleteMenu = async (menu: TMenu) => {
    try {
      await apiClient.menus.destroy(menu.id)
      setMenus((current) => current.filter((m) => m.id !== menu.id))
    } catch (error) {
      console.error(error)
    }
  }

  const toggleMenu = async (menuId: number, active: boolean) => {
    try {
      const response = await apiClient.menus.update(menuId, { active })
      setMenus((current) => current.map((m) => (m.id === menuId ? { ...m, ...response } : m)))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    void fetchMenus()
  }, [])

  const value = {
    menus,
    products,
    createMenu,
    updateMenu,
    deleteMenu,
    toggleMenu,
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenuContext = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider")
  }
  return context
}

import { createContext, useContext, useEffect, useState } from "react"
import type { TMenu, TMenuForm } from "../types/Menu"
import { apiClient } from "../services/apiClient"

type MenuContextType = {
  menus: TMenu[]

  createMenu: (menu: TMenuForm) => Promise<TMenu>
  updateMenu: (menu: TMenu) => Promise<void>
  deleteMenu: (menu: TMenu) => Promise<void>
  toggleMenu: (menuId: number, active: boolean) => Promise<void>

}

const MenuCatalogContext = createContext<MenuContextType | null>(null)

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menus, setMenus] = useState<TMenu[]>([])




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
      setMenus(menus.map((m) => (m.id === menu.id ? response : m)))
    } catch (error) {
      console.error(error)
    }
  }

  const deleteMenu = async (menu: TMenu) => {
    try {
      await apiClient.menus.destroy(menu.id)
      setMenus(menus.filter((m) => m.id !== menu.id))
    } catch (error) {
      console.error(error)
    }
  }

  const toggleMenu = async (menuId: number, active: boolean) => {
    try {
      const response = await apiClient.menus.update(menuId, { active })
      setMenus(menus.map((m) => (m.id === menuId ? response : m)))
    } catch (error) {
      console.error(error)
    }
  }



  useEffect(() => {
    fetchMenus()
  }, [])



  const value = {
    menus,

    createMenu,
    updateMenu,
    deleteMenu,
    toggleMenu,

  }
  return <MenuCatalogContext.Provider value={value}>{children}</MenuCatalogContext.Provider>
}

export const useMenuContext = () => {
  const context = useContext(MenuCatalogContext)
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider")
  }
  return context
}
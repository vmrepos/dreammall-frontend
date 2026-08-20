import { useState, useMemo, useEffect } from "react"
import { apiClient } from "../../services/apiClient"
import type { TMenu, TMenuForm } from "../../types/Menu"
import { ProductList } from "../../utils/utils"
import { MenuContext } from "../MenuContext"

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

  const updateMenu = async (id: number, menu: TMenuForm) => {
    const response = await apiClient.menus.update(id, menu)
    setMenus((current) => current.map((m) => (m.id === id ? { ...m, ...response } : m)))
    return response
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

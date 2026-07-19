import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import type { TMenu, TMenuForm } from "../types/Menu"
import type { TProduct, TProductForm } from "../types/Product"
import { apiClient } from "../services/apiClient"
import { ProductList } from "../utils/utils"

type MenuCatalogContextType = {
  menus: TMenu[]
  products: TProduct[]
  createMenu: (menu: TMenuForm) => Promise<void>
  patchMenu: (menuId: number, data: TMenuForm) => Promise<void>
  addProduct: (menuId: number, input: TProductForm) => Promise<void>
  patchProduct: (menuId: number, productId: number, input: TProductForm) => Promise<void>
  deleteMenu: (menuId: number) => Promise<void>
  deleteProduct: (menuId: number, productId: number) => Promise<void>
}

const MenuCatalogContext = createContext<MenuCatalogContextType | null>(null)

// Replace a menu in the array
const replaceMenu = (menus: TMenu[], menuId: number, updater: (menu: TMenu) => TMenu) =>
  menus.map((menu) => (menu.id === menuId ? updater(menu) : menu))

export const MenuCatalogProvider = ({ children }: { children: ReactNode }) => {
  const [menus, setMenus] = useState<TMenu[]>([])
  const [products, setProducts] = useState<TProduct[]>([])

  useEffect(() => {
    fetchMenus()
  }, [])


  useEffect(() => {
    setProducts(ProductList(menus))
  }, [menus])

  // Fetch menus from the API
  const fetchMenus = async () => {
    try {
      const res = await apiClient.menus.list()
      setMenus(res)
    } catch (err) {
      console.error(err)
    }
  }

  // Create a new menu
  const createMenu = async (menu: TMenuForm) => {
    try {
      const res = await apiClient.menus.create(menu)
      setMenus((current) => [...current, res])
    } catch (err) {
      console.error(err)
    }
  }

  // patches a menu in the api, then replaces the menu in the array
  const patchMenu = async (menuId: number, data: TMenuForm) => {
    const res = await apiClient.menus.update(menuId, data)
    setMenus((current) =>
      replaceMenu(current, menuId, (menu) => ({
        ...menu,
        ...res,
        products: res.products ?? menu.products,
      })),
    )
  }

  // adds a product to a menu in the api, then replaces the product in the array
  const addProduct = async (menuId: number, input: TProductForm) => {
    const res = await apiClient.products.create(menuId, input)
    setMenus((current) =>
      replaceMenu(current, menuId, (menu) => ({
        ...menu,
        products: [...(menu.products ?? []), res],
        products_count: (menu.products_count ?? 0) + 1,
      })),
    )
  }

  // patches a product in the api, then replaces the product in the array
  const patchProduct = async (menuId: number, productId: number, input: TProductForm) => {
    const res = await apiClient.products.update(menuId, productId, input)
    setMenus((current) =>
      replaceMenu(current, menuId, (menu) => ({
        ...menu,
        products: (menu.products ?? []).map((product) =>
          product.id === productId ? { ...product, ...res } : product,
        ),
      })),
    )
  }

  // deletes a menu in the api, then removes the menu from the array
  const deleteMenu = async (menuId: number) => {
    await apiClient.menus.destroy(menuId)
    setMenus((current) => current.filter((menu) => menu.id !== menuId))
  }

  // deletes a product in the api, then removes the product from the array
  const deleteProduct = async (menuId: number, productId: number) => {
    await apiClient.products.destroy(menuId, productId)
    setMenus((current) =>
      replaceMenu(current, menuId, (menu) => {
        const products = (menu.products ?? []).filter((product) => product.id !== productId)
        return {
          ...menu,
          products,
          products_count: products.length,
        }
      }),
    )
  }




  return (
    <MenuCatalogContext.Provider
      value={{
        menus,
        products,
        createMenu,
        patchMenu,
        addProduct,
        patchProduct,
        deleteProduct,
        deleteMenu,
      }}
    >
      {children}
    </MenuCatalogContext.Provider>
  )
}

export const useMenuCatalog = () => {
  const context = useContext(MenuCatalogContext)
  if (!context) {
    throw new Error("useMenuCatalog must be used within MenuCatalogProvider")
  }

  return context
}

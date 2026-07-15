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

export const MenuCatalogProvider = ({ children }: { children: ReactNode }) => {
  const [menus, setMenus] = useState<TMenu[]>([])
  const [products, setProducts] = useState<TProduct[]>([])

  const fetchMenus = async () => {
    const res = await apiClient.menus.list()
    setMenus(res)
  }

  const replaceMenu = (menuId: number, next: TMenu) => {
    setMenus((current) =>
      current.map((menu) => (menu.id === menuId ? { ...menu, ...next, products: next.products ?? menu.products } : menu)),
    )
  }

  const createMenu = async (menu: TMenuForm) => {
    const res = await apiClient.menus.create(menu)
    setMenus((current) => [...current, { ...res, products: res.products ?? [] }])
  }

  const patchMenu = async (menuId: number, data: TMenuForm) => {
    const res = await apiClient.menus.update(menuId, data)
    replaceMenu(menuId, res)
  }

  const addProduct = async (menuId: number, input: TProductForm) => {
    const res = await apiClient.menus.addProduct(menuId, input)
    setMenus((current) =>
      current.map((menu) =>
        menu.id === menuId
          ? {
              ...menu,
              products_count: menu.products_count + 1,
              products: [...(menu.products ?? []), res],
            }
          : menu,
      ),
    )
  }

  const patchProduct = async (menuId: number, productId: number, input: TProductForm) => {
    const res = await apiClient.menus.updateProduct(menuId, productId, input)
    setMenus((current) =>
      current.map((menu) =>
        menu.id === menuId
          ? {
              ...menu,
              products: (menu.products ?? []).map((product) =>
                product.id === productId ? { ...product, ...res } : product,
              ),
            }
          : menu,
      ),
    )
  }

  const deleteMenu = async (menuId: number) => {
    await apiClient.menus.deleteMenu(menuId)
    setMenus((current) => current.filter((menu) => menu.id !== menuId))
  }

  const deleteProduct = async (menuId: number, productId: number) => {
    await apiClient.menus.deleteProduct(menuId, productId)
    setMenus((current) =>
      current.map((menu) =>
        menu.id === menuId
          ? {
              ...menu,
              products_count: Math.max(0, menu.products_count - 1),
              products: (menu.products ?? []).filter((product) => product.id !== productId),
            }
          : menu,
      ),
    )
  }

  useEffect(() => {
    void fetchMenus()
  }, [])

  useEffect(() => {
    setProducts(ProductList(menus))
  }, [menus])

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

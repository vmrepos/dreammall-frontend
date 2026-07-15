import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initialMenuCatalog } from "../mocks/menus"
import type { TMenu } from "../types/Menu"
import type { TProduct } from "../types/Product"
import { apiClient } from "../services/apiClient"
import { ProductList } from "../utils/utils"

type ProductInput = Pick<TProduct, "name" | "description" | "price" | "active" | "combo">

type MenuCatalogContextType = {
  menus: TMenu[]
  products: TProduct[]
  addMenu: (name: string) => void
  toggleMenuActive: (menuId: number, active: boolean) => void
  addProduct: (menuId: number, input: ProductInput) => void
  updateProduct: (menuId: number, productId: number, input: ProductInput) => void
  deleteProduct: (menuId: number, productId: number) => void
  toggleProductActive: (menuId: number, productId: number, active: boolean) => void

}

const MenuCatalogContext = createContext<MenuCatalogContextType | null>(null)

const touch = () => new Date().toISOString()

const nextId = (items: { id: number }[]) =>
  items.reduce((max, item) => Math.max(max, item.id), 0) + 1

export const MenuCatalogProvider = ({ children }: { children: ReactNode }) => {
  const [menus, setMenus] = useState<TMenu[]>([])
  const [products, setProducts] = useState<TProduct[]>([])

  useEffect(() => {
    apiClient.menus.list().then((menus: TMenu[]) => {
      setMenus(menus)
      setProducts(ProductList(menus))
    })
  }, [])

  const updateMenu = (menuId: number, updater: (menu: TMenu) => TMenu) => {
    setMenus((current) =>
      current.map((menu) => (menu.id === menuId ? updater(menu) : menu)),
    )
  }

  const addMenu = (name: string) => {
    const now = touch()
    setMenus((current) => [
      ...current,
      {
        id: nextId(current),
        name,
        active: true,
        products_count: 0,
        created_at: now,
        updated_at: now,
        products: [],
      },
    ])
  }

  const toggleMenuActive = (menuId: number, active: boolean) => {
    updateMenu(menuId, (menu) => ({ ...menu, active, updated_at: touch() }))
  }

  const addProduct = (menuId: number, input: ProductInput) => {
    updateMenu(menuId, (menu) => {
      const now = touch()
      const products = menu.products ?? []
      const product: TProduct = {
        id: nextId(products),
        menu_id: menuId,
        name: input.name,
        description: input.description,
        price: input.price,
        active: input.active,
        combo: input.combo,
        position: 3,
        created_at: now,
        updated_at: now,
      }

      return {
        ...menu,
        updated_at: now,
        products_count: menu.products_count + 1,
        products: [...products, product],
      }
    })
  }

  const updateProduct = (menuId: number, productId: number, input: ProductInput) => {
    updateMenu(menuId, (menu) => ({
      ...menu,
      updated_at: touch(),
      products: (menu.products ?? []).map((product) =>
        product.id === productId
          ? { ...product, ...input, updated_at: touch() }
          : product,
      ),
    }))
  }

  const toggleProductActive = (menuId: number, productId: number, active: boolean) => {
    updateMenu(menuId, (menu) => ({
      ...menu,
      updated_at: touch(),
      products: (menu.products ?? []).map((product) =>
        product.id === productId ? { ...product, active, updated_at: touch() } : product,
      ),
    }))
  }

  const deleteProduct = (menuId: number, productId: number) => {
    updateMenu(menuId, (menu) => ({
      ...menu,
      updated_at: touch(),
      products_count: Math.max(0, menu.products_count - 1),
      products: (menu.products ?? []).filter((product) => product.id !== productId),
    }))
  }

  return (
    <MenuCatalogContext.Provider
      value={{
        menus,
        products,
        addMenu,
        toggleMenuActive,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
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

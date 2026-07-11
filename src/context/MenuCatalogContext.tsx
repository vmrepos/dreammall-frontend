import { createContext, useContext, useState, type ReactNode } from "react"
import { initialMenuCatalog } from "../mocks/menus"
import type { TMenu } from "../types/Menu"
import type { TProduct } from "../types/Product"

type ProductInput = Pick<TProduct, "name" | "description" | "price" | "active" | "combo">

type MenuCatalogContextType = {
  menus: TMenu[]
  addMenu: (name: string) => void
  toggleMenuActive: (menuId: number, active: boolean) => void
  addProduct: (menuId: number, input: ProductInput) => void
  updateProduct: (menuId: number, productId: number, input: ProductInput) => void
  toggleProductActive: (menuId: number, productId: number, active: boolean) => void
}

const MenuCatalogContext = createContext<MenuCatalogContextType | null>(null)

const touch = () => new Date().toISOString()

const nextId = (items: { id: number }[]) =>
  items.reduce((max, item) => Math.max(max, item.id), 0) + 1

export const MenuCatalogProvider = ({ children }: { children: ReactNode }) => {
  const [menus, setMenus] = useState<TMenu[]>(initialMenuCatalog)

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
      const product: TProduct = {
        id: nextId(menu.products),
        menu_id: menuId,
        name: input.name,
        description: input.description,
        price: input.price,
        active: input.active,
        combo: input.combo,
        position: menu.products.length + 1,
        created_at: now,
        updated_at: now,
      }

      return {
        ...menu,
        updated_at: now,
        products: [...menu.products, product],
      }
    })
  }

  const updateProduct = (menuId: number, productId: number, input: ProductInput) => {
    updateMenu(menuId, (menu) => ({
      ...menu,
      updated_at: touch(),
      products: menu.products.map((product) =>
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
      products: menu.products.map((product) =>
        product.id === productId ? { ...product, active, updated_at: touch() } : product,
      ),
    }))
  }

  return (
    <MenuCatalogContext.Provider
      value={{
        menus,
        addMenu,
        toggleMenuActive,
        addProduct,
        updateProduct,
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

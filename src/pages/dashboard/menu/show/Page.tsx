import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faImage, faPen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../../components/atoms/Badge"
import { Button } from "../../../../components/atoms/Button"
import { Toggle } from "../../../../components/atoms/Toggle"
import { apiClient } from "../../../../services/apiClient"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"
import { ProductTable } from "../shared/ProductTable"
import { MenuShareDialog } from "../shared/MenuShareDialog"
import { MenuNotFound } from "./NotFound"
import { GoBack } from "../../../../components/atoms/GoBack"
import { useMenuContext } from "../../../../context/MenuContext"
import { useRestaurant } from "../../../../context/RestaurantContext"

export const Page = () => {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const parsedMenuId = Number(menuId)
  const { toggleMenu } = useMenuContext()
  const { restaurant } = useRestaurant()
  const [menu, setMenu] = useState<TMenu | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.menus.show(parsedMenuId)
      setMenu(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [parsedMenuId])


  useEffect(() => {
    fetchMenu()
  }, [parsedMenuId, fetchMenu])



  const handleProductsChange = (products: TProduct[]) => {
    setMenu((current) =>
      current
        ? {
          ...current,
          products,
          products_count: products.length,
        }
        : current,
    )
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl text-sm text-gray-500">Cargando menú...</div>
  }

  if (!menu) {
    return <MenuNotFound />
  }

  return (
    <div className="@container mx-auto max-w-6xl">
      <GoBack text="Volver a menús" route="/menu" />

      <div className="mb-6 flex flex-col gap-4 @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faBookOpen} className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">Menú</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
            <Badge variant={menu.active ? "success" : "default"}>
              {menu.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-1 text-[15px] text-gray-500">
            {menu.products_count} {menu.products_count === 1 ? "producto" : "productos"}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 [&>button]:w-full @min-[40rem]:w-auto @min-[40rem]:flex-row @min-[40rem]:flex-wrap @min-[40rem]:items-center @min-[40rem]:justify-end @min-[40rem]:[&>button]:w-auto">
          <div className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2.5 @min-[40rem]:justify-start @min-[40rem]:bg-transparent @min-[40rem]:p-0">
            <span className="text-sm font-medium text-ink @min-[40rem]:hidden">
              {menu.active ? "Menú activo" : "Menú inactivo"}
            </span>
            <Toggle
              checked={menu.active}
              label={`${menu.active ? "Desactivar" : "Activar"} ${menu.name}`}
              onChange={(active) => void toggleMenu(menu.id, active)}
            />
          </div>
          <Button variant="secondary" onClick={() => navigate(`/menu/${menu.id}/edit`)}>
            <FontAwesomeIcon icon={faPen} className="size-4" aria-hidden />
            Editar menú
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShareOpen(true)}
            disabled={(menu.products ?? []).length === 0}
          >
            <FontAwesomeIcon icon={faImage} className="size-4" aria-hidden />
            Compartir menú
          </Button>
          <Button onClick={() => navigate(`/menu/${menu.id}/products/new`)}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nuevo producto
          </Button>
        </div>
      </div>

      <ProductTable
        menuId={menu.id}
        products={menu.products ?? []}
        onProductsChange={handleProductsChange}
      />

      <MenuShareDialog
        open={shareOpen}
        menuName={menu.name}
        restaurantName={restaurant?.name ?? "Mi restaurante"}
        address={restaurant?.address}
        whatsapp={restaurant?.whatsapp}
        products={menu.products ?? []}
        onClose={() => setShareOpen(false)}
      />
    </div>
  )
}

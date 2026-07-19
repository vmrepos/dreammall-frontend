import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Toggle } from "../../../components/atoms/Toggle"
import { apiClient } from "../../../services/apiClient"
import type { TMenu } from "../../../types/Menu"
import type { TProduct } from "../../../types/Product"
import { ProductTable } from "./ProductTable"
import { MenuNotFound } from "./NotFound"
import { GoBack } from "../../../components/atoms/GoBack"
import { useMenuContext } from "../../../context/MenuContext"

export const Show = () => {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const parsedMenuId = Number(menuId)
  const { toggleMenu } = useMenuContext()
  const [menu, setMenu] = useState<TMenu | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMenu = async () => {
    try {
      setLoading(true)
      const response = await apiClient.menus.show(parsedMenuId)
      setMenu(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchMenu()
  }, [parsedMenuId])



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
    <div className="mx-auto max-w-6xl">
      <GoBack text="Volver a menús" route="/menu" />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faBookOpen} className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">Menú</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
            <Badge variant={menu.active ? "success" : "default"}>
              {menu.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-1 text-[15px] text-gray-500">
            {menu.products_count} {menu.products_count === 1 ? "producto" : "productos"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Toggle
            checked={menu.active}
            label={`${menu.active ? "Desactivar" : "Activar"} ${menu.name}`}
            onChange={(active) => toggleMenu(menu.id, active)}
          />
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
    </div>
  )
}

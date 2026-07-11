import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBookOpen, faPen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Toggle } from "../../../components/atoms/Toggle"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import { getMockMenu } from "../../../mocks/menus"
import { formatCurrency } from "../../../utils/format"

export const MenuShowPage = () => {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const parsedMenuId = Number(menuId)
  const { menus, toggleMenuActive, toggleProductActive } = useMenuCatalog()
  const menu = getMockMenu(parsedMenuId, menus)

  if (!menu) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Menú no encontrado</h1>
        <Link to="/menu" className="mt-4 inline-block text-brand hover:underline">
          Volver a menús
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/menu"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a menús
      </Link>

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
            {menu.products.length} {menu.products.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Toggle
            checked={menu.active}
            label={`${menu.active ? "Desactivar" : "Activar"} ${menu.name}`}
            onChange={(active) => toggleMenuActive(menu.id, active)}
          />
          <Button onClick={() => navigate(`/menu/${menu.id}/products/new`)}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nuevo producto
          </Button>
        </div>
      </div>

      <Card>
        {menu.products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <p className="text-sm text-gray-500">Este menú no tiene productos todavía.</p>
            <Button className="mt-6" onClick={() => navigate(`/menu/${menu.id}/products/new`)}>
              Agregar primer producto
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Activo</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menu.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.description && (
                        <p className="mt-1 text-xs text-gray-500">{product.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.combo ? "info" : "default"}>
                        {product.combo ? "Combo" : "Simple"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.active ? "success" : "default"}>
                        {product.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Toggle
                        checked={product.active}
                        label={`${product.active ? "Desactivar" : "Activar"} ${product.name}`}
                        onChange={(active) => toggleProductActive(menu.id, product.id, active)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        className="px-3 py-2"
                        onClick={() => navigate(`/menu/${menu.id}/products/${product.id}/edit`)}
                      >
                        <FontAwesomeIcon icon={faPen} className="size-4" aria-hidden />
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

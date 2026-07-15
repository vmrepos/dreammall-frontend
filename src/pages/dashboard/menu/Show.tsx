import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBookOpen, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Toggle } from "../../../components/atoms/Toggle"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import type { TProduct } from "../../../types/Product"
import { formatCurrency } from "../../../utils/format"
import type { TMenu } from "../../../types/Menu"
import { apiClient } from "../../../services/apiClient"

export const MenuShowPage = () => {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const parsedMenuId = Number(menuId)
  const { patchMenu } = useMenuCatalog()
  const [productToDelete, setProductToDelete] = useState<TProduct | null>(null)
  const [productToToggle, setProductToToggle] = useState<TProduct | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [menu, setMenu] = useState<TMenu | null>(null)

  useEffect(() => {
    apiClient.menus.show(parsedMenuId).then((menu: TMenu) => {
      setMenu(menu)
    })
  }, [parsedMenuId])

  const handleMenuActive = async (active: boolean) => {
    if (!menu) return
    await patchMenu(menu.id, { active })
    setMenu((current) => (current ? { ...current, active } : current))
  }

  const confirmDelete = async () => {
    if (!productToDelete || !menu || deleting) return

    setDeleting(true)
    try {
      await apiClient.products.destroy(menu.id, productToDelete.id)
      setMenu((current) => {
        if (!current) return current
        return {
          ...current,
          products_count: Math.max(0, current.products_count - 1),
          products: (current.products ?? []).filter((product) => product.id !== productToDelete.id),
        }
      })
      setProductToDelete(null)
    } catch {
      // Keep dialog open so the user can retry or cancel.
    } finally {
      setDeleting(false)
    }
  }

  const confirmToggle = async () => {
    if (!productToToggle || !menu || toggling) return

    setToggling(true)
    try {
      const updated = await apiClient.products.toggle(menu.id, productToToggle.id)
      setMenu((current) => {
        if (!current) return current
        return {
          ...current,
          products: (current.products ?? []).map((product) =>
            product.id === updated.id ? { ...product, ...updated } : product,
          ),
        }
      })
      setProductToToggle(null)
    } catch {
      // Keep dialog open so the user can retry or cancel.
    } finally {
      setToggling(false)
    }
  }

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

  const toggleNextActive = productToToggle ? !productToToggle.active : false

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
            {menu.products_count} {menu.products_count === 1 ? "producto" : "productos"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Toggle
            checked={menu.active}
            label={`${menu.active ? "Desactivar" : "Activar"} ${menu.name}`}
            onChange={(active) => void handleMenuActive(active)}
          />
          <Button onClick={() => navigate(`/menu/${menu.id}/products/new`)}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nuevo producto
          </Button>
        </div>
      </div>

      <Card>
        {(menu.products ?? []).length === 0 ? (
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
                {(menu.products ?? []).map((product) => (
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
                        onChange={() => setProductToToggle(product)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          className="px-3 py-2"
                          onClick={() => navigate(`/menu/${menu.id}/products/${product.id}/edit`)}
                        >
                          <FontAwesomeIcon icon={faPen} className="size-4" aria-hidden />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setProductToDelete(product)}
                        >
                          <FontAwesomeIcon icon={faTrash} className="size-4" aria-hidden />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={productToDelete !== null}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel={deleting ? "Eliminando..." : "Sí, eliminar"}
        confirming={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setProductToDelete(null)
        }}
      />

      <ConfirmDialog
        open={productToToggle !== null}
        title={toggleNextActive ? "Activar producto" : "Desactivar producto"}
        message={
          toggleNextActive
            ? `¿Deseas activar "${productToToggle?.name}"? Quedará disponible en este menú.`
            : `¿Deseas desactivar "${productToToggle?.name}"? Dejará de estar disponible en este menú.`
        }
        confirmLabel={
          toggling
            ? "Guardando..."
            : toggleNextActive
              ? "Sí, activar"
              : "Sí, desactivar"
        }
        confirmVariant={toggleNextActive ? "primary" : "danger"}
        confirming={toggling}
        onConfirm={confirmToggle}
        onCancel={() => {
          if (!toggling) setProductToToggle(null)
        }}
      />
    </div>
  )
}

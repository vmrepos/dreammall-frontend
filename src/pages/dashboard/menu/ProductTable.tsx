import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Toggle } from "../../../components/atoms/Toggle"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { apiClient } from "../../../services/apiClient"
import type { TProduct } from "../../../types/Product"
import { formatCurrency } from "../../../utils/format"

type Props = {
  menuId: number
  products: TProduct[]
  onProductsChange: (products: TProduct[]) => void
}

export const ProductTable = ({ menuId, products, onProductsChange }: Props) => {
  const navigate = useNavigate()
  const [productToDelete, setProductToDelete] = useState<TProduct | null>(null)
  const [productToToggle, setProductToToggle] = useState<TProduct | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)

  const confirmDelete = async () => {
    if (!productToDelete || deleting) return

    setDeleting(true)
    try {
      await apiClient.products.destroy(menuId, productToDelete.id)
      onProductsChange(products.filter((product) => product.id !== productToDelete.id))
      setProductToDelete(null)
    } catch {
      // Keep dialog open so the user can retry or cancel.
    } finally {
      setDeleting(false)
    }
  }

  const confirmToggle = async () => {
    if (!productToToggle || toggling) return

    setToggling(true)
    try {
      const updated = await apiClient.products.toggle(menuId, productToToggle.id)
      onProductsChange(
        products.map((product) =>
          product.id === updated.id ? { ...product, ...updated } : product,
        ),
      )
      setProductToToggle(null)
    } catch {
      // Keep dialog open so the user can retry or cancel.
    } finally {
      setToggling(false)
    }
  }

  const toggleNextActive = productToToggle ? !productToToggle.active : false

  return (
    <>
      <Card>
        {products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <p className="text-sm text-gray-500">Este menú no tiene productos todavía.</p>
            <Button className="mt-6" onClick={() => navigate(`/menu/${menuId}/products/new`)}>
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
                {products.map((product) => (
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
                          onClick={() => navigate(`/menu/${menuId}/products/${product.id}/edit`)}
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
    </>
  )
}

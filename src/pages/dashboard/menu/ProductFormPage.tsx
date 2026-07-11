import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { Toggle } from "../../../components/atoms/Toggle"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import { getMockMenu, getMockProduct } from "../../../mocks/menus"

export const ProductFormPage = () => {
  const { menuId, productId } = useParams()
  const navigate = useNavigate()
  const parsedMenuId = Number(menuId)
  const parsedProductId = productId ? Number(productId) : null
  const isEditing = parsedProductId !== null

  const { menus, addProduct, updateProduct } = useMenuCatalog()
  const menu = getMockMenu(parsedMenuId, menus)
  const existingProduct =
    parsedProductId !== null ? getMockProduct(parsedMenuId, parsedProductId, menus) : undefined

  const [name, setName] = useState(existingProduct?.name ?? "")
  const [description, setDescription] = useState(existingProduct?.description ?? "")
  const [price, setPrice] = useState(existingProduct?.price ?? "")
  const [active, setActive] = useState(existingProduct?.active ?? true)
  const [combo, setCombo] = useState(existingProduct?.combo ?? false)

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

  if (isEditing && !existingProduct) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
        <Link to={`/menu/${menu.id}`} className="mt-4 inline-block text-brand hover:underline">
          Volver al menú
        </Link>
      </div>
    )
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()

    const input = {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      active,
      combo,
    }

    if (isEditing && parsedProductId !== null) {
      updateProduct(parsedMenuId, parsedProductId, input)
    } else {
      addProduct(parsedMenuId, input)
    }

    navigate(`/menu/${menu.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/menu/${menu.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a {menu.name}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h1>
        <p className="mt-1 text-[15px] text-gray-500">{menu.name}</p>
      </div>

      <Card padding="lg">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="product-name">Nombre</Label>
            <Input
              id="product-name"
              className="mt-2"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="Ej. Hamburguesa clásica"
              required
            />
          </div>

          <div>
            <Label htmlFor="product-description">Descripción</Label>
            <Input
              id="product-description"
              className="mt-2"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div>
            <Label htmlFor="product-price">Precio</Label>
            <Input
              id="product-price"
              className="mt-2"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Producto activo</p>
              <p className="text-xs text-gray-500">Visible y disponible en este menú</p>
            </div>
            <Toggle
              checked={active}
              label="Activar producto"
              onChange={setActive}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Es combo</p>
              <p className="text-xs text-gray-500">Marcar si este producto es un bundle</p>
            </div>
            <Toggle
              checked={combo}
              label="Marcar como combo"
              onChange={setCombo}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button type="button" variant="secondary" onClick={() => navigate(`/menu/${menu.id}`)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Guardar cambios" : "Crear producto"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

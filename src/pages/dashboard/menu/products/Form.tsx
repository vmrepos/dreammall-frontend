import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { GoBack } from "../../../../components/atoms/GoBack"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import { Toggle } from "../../../../components/atoms/Toggle"
import { apiClient } from "../../../../services/apiClient"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"

export const Form = () => {
  const { menuId, productId } = useParams()
  const navigate = useNavigate()

  const parsedMenuId = Number(menuId)
  const parsedProductId = productId ? Number(productId) : null
  const isEditing = parsedProductId !== null

  const [menu, setMenu] = useState<TMenu | null>(null)
  const [existingProduct, setExistingProduct] = useState<TProduct | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [active, setActive] = useState(true)
  const [combo, setCombo] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    apiClient.menus
      .show(parsedMenuId)
      .then((loadedMenu: TMenu) => {
        if (cancelled) return

        setMenu(loadedMenu)

        if (!isEditing || parsedProductId === null) {
          setExistingProduct(null)
          return
        }

        const product = loadedMenu.products?.find((item) => item.id === parsedProductId) ?? null
        setExistingProduct(product)

        if (product) {
          setName(product.name)
          setDescription(product.description ?? "")
          setPrice(product.price)
          setActive(product.active)
          setCombo(product.combo)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMenu(null)
          setExistingProduct(null)
          setError("No se pudo cargar el menú.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [parsedMenuId, parsedProductId, isEditing])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Menú no encontrado</h1>
        {error && <p className="mt-2 text-sm text-gray-500">{error}</p>}
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

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmitting(true)
    setError(null)

    const input = {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      active,
      combo,
    }

    try {
      if (isEditing && parsedProductId !== null) {
        await apiClient.products.update(parsedMenuId, parsedProductId, input)
      } else {
        await apiClient.products.create(parsedMenuId, input)
      }

      navigate(`/menu/${menu.id}`)
    } catch {
      setError("No se pudo guardar el producto. Intenta de nuevo.")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <GoBack text={`Volver a ${menu.name}`} route={`/menu/${menu.id}`} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h1>
        <p className="mt-1 text-[15px] text-gray-500">{menu.name}</p>
      </div>

      <Card padding="lg">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

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
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear producto"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

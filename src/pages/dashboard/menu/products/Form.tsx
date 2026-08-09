import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { GoBack } from "../../../../components/atoms/GoBack"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import { Toggle } from "../../../../components/atoms/Toggle"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct, TProductForm } from "../../../../types/Product"
import { OptionGroupsEditor } from "./OptionGroupsEditor"
import {
  groupsFromProduct,
  toGroupsAttributes,
  type TProductOptionGroupForm,
} from "./optionGroups"

type ProductEditorValues = {
  name: string
  description: string
  price: string
  active: boolean
  combo: boolean
  product_option_groups: TProductOptionGroupForm[]
}

export const Form = () => {
  const { menuId, productId } = useParams()

  const parsedMenuId = Number(menuId)
  const parsedProductId = productId ? Number(productId) : null
  const isEditing = parsedProductId !== null

  const [menu, setMenu] = useState<TMenu | null>(null)
  const [existingProduct, setExistingProduct] = useState<TProduct | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <ProductEditor
      menu={menu}
      product={existingProduct ?? null}
      parsedMenuId={parsedMenuId}
      parsedProductId={parsedProductId}
      isEditing={isEditing}
    />
  )
}

type ProductEditorProps = {
  menu: TMenu
  product: TProduct | null
  parsedMenuId: number
  parsedProductId: number | null
  isEditing: boolean
}

const ProductEditor = ({
  menu,
  product,
  parsedMenuId,
  parsedProductId,
  isEditing,
}: ProductEditorProps) => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { values, handleChange, handleSubmit, mutate } = useForm<ProductEditorValues>({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? "",
      active: product?.active ?? true,
      combo: product?.combo ?? false,
      product_option_groups: groupsFromProduct(product),
    },
    onSubmit: async (formValues) => {
      setSubmitting(true)
      setError(null)

      const input: TProductForm = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        price: formValues.price.trim(),
        active: formValues.active,
        combo: formValues.combo,
        product_option_groups_attributes: toGroupsAttributes(formValues.product_option_groups),
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
    },
  })

  return (
    <div className="mx-auto max-w-6xl">
      <GoBack text={`Volver a ${menu.name}`} route={`/menu/${menu.id}`} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h1>
        <p className="mt-1 text-[15px] text-gray-500">{menu.name}</p>
      </div>

      <form
        className="grid items-start gap-4 lg:grid-cols-[minmax(20rem,24rem)_minmax(0,1fr)]"
        onSubmit={handleSubmit}
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">
            {error}
          </p>
        )}

        <Card padding="lg" className="grid gap-5">
          <h2 className="text-sm font-semibold text-gray-900">Información general</h2>

          <div>
            <Label htmlFor="product-name">Nombre</Label>
            <Input
              id="product-name"
              name="name"
              className="mt-2"
              value={values.name}
              onChange={handleChange}
              placeholder="Ej. Hamburguesa clásica"
              required
            />
          </div>

          <div>
            <Label htmlFor="product-description">Descripción</Label>
            <Input
              id="product-description"
              name="description"
              className="mt-2"
              value={values.description}
              onChange={handleChange}
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
              value={values.price}
              onChange={(ev) => mutate({ price: ev.target.value })}
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
              checked={values.active}
              label="Activar producto"
              onChange={(active) => mutate({ active })}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Es combo</p>
              <p className="text-xs text-gray-500">Marcar si este producto es un bundle</p>
            </div>
            <Toggle
              checked={values.combo}
              label="Marcar como combo"
              onChange={(combo) => mutate({ combo })}
            />
          </div>
        </Card>

        <Card padding="lg">
          <OptionGroupsEditor
            groups={values.product_option_groups}
            onChange={(product_option_groups) => mutate({ product_option_groups })}
          />
        </Card>

        <div className="flex justify-end gap-3 lg:col-span-2">
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
    </div>
  )
}

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClipboardList, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card, CardHeader } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { useMenuContext } from "../../../context/MenuContext"
import { useOrders } from "../../../context/OrdersContext"
import { useForm } from "../../../hooks/useForm"
import { apiClient } from "../../../services/apiClient"
import type { TOrderForm } from "../../../types/Order"
import type { TProduct } from "../../../types/Product"
import { parseCoordinates } from "../../../utils/coordinates"
import { formatCurrency } from "../../../utils/format"
import { toast } from "sonner"
import { CartItem } from "./CartItem"

const initialValues: TOrderForm = {
  items_attributes: [],
  delivery_fee: 0,
  discount: 0,
  latitude: null,
  longitude: null,
  distance_km: null,
  coordinates: "",
}

export const Create = () => {
  const navigate = useNavigate()
  const { products } = useMenuContext()
  const { createOrder } = useOrders()
  const [coordsError, setCoordsError] = useState("")
  const [previewError, setPreviewError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { values, handleChange, handleSubmit, mutate } = useForm<TOrderForm>({
    initialValues,
    onSubmit: async (formValues) => {
      if (formValues.items_attributes.length === 0 || formValues.distance_km == null) return
      if (formValues.latitude == null || formValues.longitude == null) return

      const subtotal = formValues.items_attributes.reduce(
        (sum, line) => sum + line.quantity * Number(line.unit_price),
        0,
      )
      const total_amount = subtotal + Number(formValues.delivery_fee) - Number(formValues.discount)

      setIsSubmitting(true)
      try {
        const order = await createOrder({ ...formValues, total_amount })
        toast.success("Pedido creado")
        navigate(`/orders/${order.id}`)
      } catch {
        toast.error("No se pudo crear el pedido. Intenta de nuevo.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const cart = values.items_attributes

  const subtotal = cart.reduce(
    (sum, line) => sum + line.quantity * Number(line.unit_price),
    0,
  )

  const total = subtotal + Number(values.delivery_fee) - Number(values.discount)

  const addToCart = (product: TProduct) => {
    const existing = cart.find((line) => line.product_id === product.id)
    if (existing) {
      mutate({
        items_attributes: cart.map((line) =>
          line.product_id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        ),
      })
      return
    }

    mutate({
      items_attributes: [
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          unit_price: product.price,
          quantity: 1,
          notes: "",
        },
      ],
    })
  }

  const updateQuantity = (product_id: number, quantity: number) => {
    if (quantity < 1) {
      mutate({
        items_attributes: cart.filter((line) => line.product_id !== product_id),
      })
      return
    }

    mutate({
      items_attributes: cart.map((line) =>
        line.product_id === product_id ? { ...line, quantity } : line,
      ),
    })
  }

  const removeFromCart = (product_id: number) => {
    mutate({
      items_attributes: cart.filter((line) => line.product_id !== product_id),
    })
  }

  const calculateDeliveryQuote = async () => {
    setCoordsError("")
    setPreviewError("")

    const parsed = parseCoordinates(values.coordinates)
    if (!parsed) {
      setCoordsError("Usa el formato latitud, longitud. Ej. -17.741364, -63.190680")
      mutate({
        delivery_fee: 0,
        distance_km: null,
        latitude: null,
        longitude: null,
      })
      return
    }

    setIsCalculating(true)
    try {
      const preview = await apiClient.deliveries.preview(parsed.latitude, parsed.longitude)
      mutate({
        delivery_fee: Number(preview.fee),
        distance_km: Number(preview.distance_km),
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      })
    } catch {
      setPreviewError("No se pudo calcular la tarifa. Revisa las coordenadas e intenta de nuevo.")
      mutate({
        delivery_fee: 0,
        distance_km: null,
        latitude: null,
        longitude: null,
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="mx-auto max-w-[90rem]">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a pedidos
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-brand">
          <FontAwesomeIcon icon={faClipboardList} className="size-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wide">Nuevo pedido</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Crear pedido</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Agrega productos del menú activo para registrar un pedido manual.
        </p>
      </div>

      <form
        className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(16rem,0.85fr)] lg:gap-5"
        onSubmit={handleSubmit}
      >
        <Card className="flex min-h-0 flex-col border-2 !border-brand/50 lg:h-[min(36rem,calc(100svh-12rem))]">
          <CardHeader
            title="Productos disponibles"
            description="Selecciona ítems de tus menús activos"
          />
          {products.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-gray-500">
              No hay productos activos. Activa un menú y sus productos primero.
            </p>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm">
                  <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-1.5">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      </td>
                      <td className="px-4 py-1.5 text-sm font-medium tabular-nums text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-1.5 text-right">
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-1 rounded-lg px-2.5 py-1 text-xs"
                          onClick={() => addToCart(product)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="size-3" aria-hidden />
                          Agregar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="flex min-h-0 flex-col border-2 !border-accent-sun/55 lg:h-[min(36rem,calc(100svh-12rem))]">
          <CardHeader title="Ítems del pedido" description="Ajusta cantidades y notas" />
          {cart.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-gray-500">
              Agrega al menos un producto para continuar.
            </p>
          ) : (
            <div className="min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto px-4 pb-3">
              {cart.map((line) => (
                <CartItem
                  key={line.product_id}
                  line={line}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          )}
        </Card>

        <Card
          padding="md"
          className="border-2 !border-accent-clay/50 lg:sticky lg:top-4"
        >
          <h2 className="mb-3 text-base font-semibold text-gray-900">Resumen</h2>

          <div>
            <Label htmlFor="coordinates">Ubicación (lat, lng)</Label>
            <Input
              id="coordinates"
              name="coordinates"
              className="mt-1.5"
              value={values.coordinates}
              onChange={handleChange}
              placeholder="-17.741364, -63.190680"
            />
            <p className="mt-1 text-xs text-gray-500">
              Pega las coordenadas de WhatsApp o Maps.
            </p>
            {coordsError && (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {coordsError}
              </p>
            )}
            {previewError && (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {previewError}
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              className="mt-2 w-full rounded-lg px-3 py-2 text-xs"
              onClick={calculateDeliveryQuote}
              disabled={!values.coordinates.trim() || isCalculating}
            >
              {isCalculating ? "Calculando..." : "Calcular envío"}
            </Button>
          </div>

          {values.distance_km != null && (
            <div className="mt-3 rounded-lg bg-brand-light px-3 py-2.5">
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Distancia</dt>
                  <dd className="mt-0.5 font-semibold text-gray-900">{values.distance_km} km</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Envío</dt>
                  <dd className="mt-0.5 font-semibold text-brand">
                    {formatCurrency(values.delivery_fee)}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-3">
            <Label htmlFor="discount">Descuento</Label>
            <Input
              id="discount"
              name="discount"
              className="mt-1.5"
              type="number"
              min="0"
              step="0.01"
              value={values.discount}
              onChange={handleChange}
            />
          </div>

          <dl className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium tabular-nums text-gray-900">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Envío</dt>
              <dd className="font-medium tabular-nums text-gray-900">
                {formatCurrency(values.delivery_fee)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Descuento</dt>
              <dd className="font-medium tabular-nums text-gray-900">
                -{formatCurrency(values.discount)}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-gray-100 pt-2">
              <dt className="font-semibold text-gray-900">Total</dt>
              <dd className="text-base font-bold tabular-nums text-brand">{formatCurrency(total)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="submit"
              disabled={cart.length === 0 || values.distance_km == null || isCalculating || isSubmitting}
              className="w-full rounded-lg py-2.5"
            >
              {isSubmitting ? "Creando..." : "Crear pedido"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full rounded-lg py-2.5"
              onClick={() => navigate("/orders")}
            >
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}

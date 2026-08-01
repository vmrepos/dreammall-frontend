import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { useMenuContext } from "../../../context/MenuContext"
import { useOrders } from "../../../context/OrdersContext"
import { useCart } from "../../../hooks/useCart"
import { useForm } from "../../../hooks/useForm"
import { apiClient } from "../../../services/apiClient"
import type { TOrderForm } from "../../../types/Order"
import { parseCoordinates } from "../../../utils/coordinates"
import { AvailableProducts } from "./AvailableProducts"
import { OrderCartPanel } from "./OrderCartPanel"
import { OrderSummary } from "./OrderSummary"

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
      setIsSubmitting(true)
      try {
        const order = await createOrder({ ...formValues })
        toast.success("Pedido creado")
        navigate(`/orders/${order.id}`)
      } catch {
        toast.error("No se pudo crear el pedido. Intenta de nuevo.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const cart = useCart({
    items: values.items_attributes,
    setItems: (items) => mutate({ items_attributes: items }),
  })

  const total = cart.subtotal + Number(values.delivery_fee) - Number(values.discount)

  const calculateDeliveryQuote = async () => {
    setCoordsError("")
    setPreviewError("")

    const parsed = parseCoordinates(values.coordinates)
    if (!parsed) {
      setCoordsError("Usa el formato latitud, longitud. Ej. -17.741364, -63.190680")
      mutate({ delivery_fee: 0, distance_km: null, latitude: null, longitude: null })
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
      mutate({ delivery_fee: 0, distance_km: null, latitude: null, longitude: null })
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
        <AvailableProducts products={products} onAdd={cart.add} />
        <OrderCartPanel
          items={cart.items}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.remove}
        />
        <OrderSummary
          values={values}
          subtotal={cart.subtotal}
          total={total}
          coordsError={coordsError}
          previewError={previewError}
          isCalculating={isCalculating}
          isSubmitting={isSubmitting}
          canSubmit={
            cart.items.length > 0 &&
            values.distance_km != null &&
            !isCalculating &&
            !isSubmitting
          }
          onChange={handleChange}
          onCalculateDelivery={calculateDeliveryQuote}
          onCancel={() => navigate("/orders")}
        />
      </form>
    </div>
  )
}

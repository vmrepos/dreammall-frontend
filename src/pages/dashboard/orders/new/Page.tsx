import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { useMenuContext } from "../../../../context/MenuContext"
import { useOrders } from "../../../../context/OrdersContext"
import { useCart } from "../../../../hooks/useCart"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { TOrderForm } from "../../../../types/Order"
import type { TOrderItemOption } from "../../../../types/OrderItem"
import type { TProduct } from "../../../../types/Product"
import { parseCoordinates } from "../../../../utils/coordinates"
import { AvailableProducts } from "./AvailableProducts"
import { OrderCartPanel } from "./OrderCartPanel"
import { OrderSummary } from "./OrderSummary"
import { ProductOptionsDialog } from "./ProductOptionsDialog"

const productHasOptions = (product: TProduct) =>
  (product.product_option_groups ?? []).some((group) =>
    (group.product_options ?? []).some((option) => option.active !== false),
  )

const toMoney = (n: number) => Math.round(Number(n) * 100) / 100

const lineSubtotal = (items: TOrderForm["items_attributes"]) =>
  items.reduce((sum, line) => sum + line.quantity * Number(line.unit_price), 0)

const clampDiscount = (discount: number, subtotal: number, deliveryFee: number) => {
  const max = toMoney(Math.max(0, subtotal + Number(deliveryFee)))
  if (!Number.isFinite(discount) || discount < 0) return 0
  return Math.min(toMoney(discount), max)
}

const initialValues: TOrderForm = {
  items_attributes: [],
  delivery_fee: 0,
  discount: 0,
  latitude: null,
  longitude: null,
  distance_km: null,
  coordinates: "",
  notes: "",
}

export const Page = () => {
  const navigate = useNavigate()
  const { products } = useMenuContext()
  const { createOrder } = useOrders()
  const [coordsError, setCoordsError] = useState("")
  const [previewError, setPreviewError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customizing, setCustomizing] = useState<TProduct | null>(null)
  const [customizeKey, setCustomizeKey] = useState(0)

  const { values, handleChange, handleSubmit, mutate, setValues } = useForm<TOrderForm>({
    initialValues,
    onSubmit: async (formValues) => {
      if (formValues.items_attributes.length === 0 || formValues.distance_km == null) return
      if (formValues.latitude == null || formValues.longitude == null) return
      const subtotal = lineSubtotal(formValues.items_attributes)
      if (toMoney(Number(formValues.discount)) > toMoney(subtotal + Number(formValues.delivery_fee))) {
        toast.error("El descuento no puede ser mayor al total")
        return
      }
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
    setItems: (updater) => {
      setValues((current) => {
        const items_attributes = updater(current.items_attributes)
        return {
          ...current,
          items_attributes,
          discount: clampDiscount(
            Number(current.discount),
            lineSubtotal(items_attributes),
            current.delivery_fee,
          ),
        }
      })
    },
  })

  const handleAddProduct = (product: TProduct) => {
    if (productHasOptions(product)) {
      setCustomizeKey((key) => key + 1)
      setCustomizing(product)
      return
    }
    cart.add(product)
  }

  const handleConfirmOptions = (options: TOrderItemOption[]) => {
    if (!customizing) return
    cart.add(customizing, options)
    setCustomizing(null)
  }

  const maxDiscount = toMoney(Math.max(0, cart.subtotal + Number(values.delivery_fee)))
  const discount = toMoney(Number(values.discount))
  const discountTooHigh = discount > maxDiscount
  const total = Math.max(0, cart.subtotal + Number(values.delivery_fee) - discount)

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    mutate({
      discount: clampDiscount(raw === "" ? 0 : Number(raw), cart.subtotal, values.delivery_fee),
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
        discount: clampDiscount(Number(values.discount), cart.subtotal, 0),
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
        discount: clampDiscount(Number(values.discount), cart.subtotal, Number(preview.fee)),
      })
    } catch {
      setPreviewError("No se pudo calcular la tarifa. Revisa las coordenadas e intenta de nuevo.")
      mutate({
        delivery_fee: 0,
        distance_km: null,
        latitude: null,
        longitude: null,
        discount: clampDiscount(Number(values.discount), cart.subtotal, 0),
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
        <AvailableProducts products={products} onAdd={handleAddProduct} />
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
          maxDiscount={maxDiscount}
          discountError={
            discountTooHigh ? "El descuento no puede ser mayor al total" : ""
          }
          canSubmit={
            cart.items.length > 0 &&
            values.distance_km != null &&
            !isCalculating &&
            !isSubmitting &&
            !discountTooHigh
          }
          onChange={(e) => {
            if (e.target.name === "discount") {
              handleDiscountChange(e)
              return
            }
            handleChange(e)
          }}
          onCalculateDelivery={calculateDeliveryQuote}
          onCancel={() => navigate("/orders")}
        />
      </form>

      {customizing && (
        <ProductOptionsDialog
          key={customizeKey}
          product={customizing}
          onConfirm={handleConfirmOptions}
          onCancel={() => setCustomizing(null)}
        />
      )}
    </div>
  )
}

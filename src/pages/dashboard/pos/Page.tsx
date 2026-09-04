import { useEffect, useState, type CSSProperties } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCashRegister } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { toast } from "sonner"
import { useMenuContext } from "../../../context/MenuContext"
import { useOrders } from "../../../context/OrdersContext"
import { useRestaurant } from "../../../context/RestaurantContext"
import { useCart } from "../../../hooks/useCart"
import { useForm } from "../../../hooks/useForm"
import { apiClient } from "../../../services/apiClient"
import type { TOrderForm, TPaymentMethod } from "../../../types/Order"
import type { TOrderItemOption } from "../../../types/OrderItem"
import type { TProduct } from "../../../types/Product"
import { cn } from "../../../utils/format"
import { CatalogStep } from "./CatalogStep"
import { CheckoutStep } from "./CheckoutStep"
import { CustomerStep } from "./CustomerStep"
import { ProductOptionsDialog } from "../orders/new/ProductOptionsDialog"
import { OrdersQueueRail } from "../orders/shared/OrdersQueueRail"
import { Stepper, type TPosStep } from "./Stepper"

const PHONE_DIGITS = 8

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

const isBoliviaPhone = (value: string) => value.length === PHONE_DIGITS && /^\d+$/.test(value)

const toBoliviaPhone = (value: string) => `+591${value}`

type TGap = { step: TPosStep; message: string }

const collectGaps = ({
  formValues,
  itemCount,
  feeStatus,
  feeError,
  discountTooHigh,
  method,
  changeFor,
  total,
}: {
  formValues: TOrderForm
  itemCount: number
  feeStatus: "idle" | "loading" | "ready" | "error"
  feeError: string
  discountTooHigh: boolean
  method: TPaymentMethod
  changeFor: string
  total: number
}): TGap[] => {
  const gaps: TGap[] = []
  if (!formValues.customer_name?.trim()) {
    gaps.push({ step: 1, message: "Falta el nombre del cliente" })
  }
  if (!isBoliviaPhone(formValues.customer_phone ?? "")) {
    gaps.push({ step: 1, message: "Falta un teléfono de 8 dígitos" })
  }
  if (formValues.latitude == null || formValues.longitude == null) {
    gaps.push({ step: 1, message: "Falta la ubicación de entrega" })
  } else if (feeStatus === "error") {
    gaps.push({ step: 1, message: feeError || "No se pudo calcular el envío para esta ubicación" })
  } else if (feeStatus !== "ready") {
    gaps.push({ step: 3, message: "Espera a que se calcule el envío" })
  }
  if (itemCount === 0) {
    gaps.push({ step: 2, message: "Agrega al menos un producto" })
  }
  if (discountTooHigh) {
    gaps.push({ step: 3, message: "El descuento no puede ser mayor al total" })
  }
  if (method === "cash") {
    const bill = Number(changeFor)
    if (!Number.isFinite(bill) || bill <= 0) {
      gaps.push({ step: 3, message: "Indica de qué billete necesita cambio" })
    } else if (bill < total) {
      gaps.push({ step: 3, message: "El billete debe cubrir el total" })
    }
  }
  return gaps
}

const apiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback
  const body = error.response?.data?.error as string | string[] | undefined
  if (Array.isArray(body)) return body.join(", ")
  if (typeof body === "string" && body.trim()) return body
  return fallback
}

const initialValues: TOrderForm = {
  items_attributes: [],
  delivery_fee: 0,
  discount: 0,
  notes: "",
  customer_name: "",
  customer_phone: "",
}

export const Page = () => {
  const navigate = useNavigate()
  const { products, menus } = useMenuContext()
  const { createOrder } = useOrders()
  const { restaurant } = useRestaurant()
  const [step, setStep] = useState<TPosStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customizing, setCustomizing] = useState<TProduct | null>(null)
  const [customizeKey, setCustomizeKey] = useState(0)
  const [method, setMethod] = useState<TPaymentMethod>("qr")
  const [changeFor, setChangeFor] = useState("")
  const [paymentError, setPaymentError] = useState("")
  const [feeStatus, setFeeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [feeError, setFeeError] = useState("")

  const { values, handleChange, handleSubmit, mutate, setValues } = useForm<TOrderForm>({
    initialValues,
    onSubmit: async (formValues) => {
      const subtotal = lineSubtotal(formValues.items_attributes)
      const payable = Math.max(
        0,
        subtotal + Number(formValues.delivery_fee) - toMoney(Number(formValues.discount)),
      )
      const gaps = collectGaps({
        formValues,
        itemCount: formValues.items_attributes.length,
        feeStatus,
        feeError,
        discountTooHigh:
          toMoney(Number(formValues.discount)) > toMoney(subtotal + Number(formValues.delivery_fee)),
        method,
        changeFor,
        total: payable,
      })
      if (gaps.length > 0) {
        toast.error(gaps.map((gap) => gap.message).join(". "))
        setStep(gaps[0].step)
        return
      }
      setPaymentError("")
      setIsSubmitting(true)
      try {
        const order = await createOrder({
          ...formValues,
          customer_name: formValues.customer_name?.trim(),
          customer_phone: toBoliviaPhone(formValues.customer_phone ?? ""),
          notes: formValues.notes?.trim(),
        })
        if (!order.public_token) {
          toast.error("Pedido creado, pero no se pudo guardar el pago.")
          navigate(`/orders/${order.id}`)
          return
        }
        try {
          await apiClient.publicOrders.complete(order.public_token, {
            customer_name: formValues.customer_name?.trim() ?? "",
            customer_phone: toBoliviaPhone(formValues.customer_phone ?? ""),
            notes: formValues.notes?.trim() ?? "",
            latitude: Number(formValues.latitude),
            longitude: Number(formValues.longitude),
            from_restaurant: true,
          })
          await apiClient.publicOrders.complete(order.public_token, {
            payment_method: method,
            change_for: method === "cash" ? Number(changeFor) : null,
            from_restaurant: true,
          })
        } catch (error) {
          toast.error(apiErrorMessage(error, "Pedido creado. No se pudo guardar ubicación o pago."))
          navigate(`/orders/${order.id}`)
          return
        }
        toast.success("Pedido creado")
        navigate(`/orders/${order.id}`)
      } catch (error) {
        toast.error(apiErrorMessage(error, "No se pudo crear el pedido. Intenta de nuevo."))
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

  useEffect(() => {
    if (values.latitude == null || values.longitude == null) {
      setFeeStatus("idle")
      setFeeError("")
      return
    }

    let cancelled = false
    setFeeStatus("loading")
    setFeeError("")

    void apiClient.deliveries
      .preview(values.latitude, values.longitude)
      .then((preview) => {
        if (cancelled) return
        setValues((current) => ({
          ...current,
          delivery_fee: Number(preview.fee),
          distance_km: Number(preview.distance_km),
          discount: clampDiscount(
            Number(current.discount),
            lineSubtotal(current.items_attributes),
            Number(preview.fee),
          ),
        }))
        setFeeStatus("ready")
      })
      .catch((error) => {
        if (cancelled) return
        setFeeStatus("error")
        setFeeError(apiErrorMessage(error, "No se pudo calcular el envío para esta ubicación."))
      })

    return () => {
      cancelled = true
    }
  }, [values.latitude, values.longitude, setValues])

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
  const gaps = collectGaps({
    formValues: values,
    itemCount: cart.items.length,
    feeStatus,
    feeError,
    discountTooHigh,
    method,
    changeFor,
    total,
  })

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    mutate({
      discount: clampDiscount(raw === "" ? 0 : Number(raw), cart.subtotal, values.delivery_fee),
    })
  }

  const addedCounts = cart.items.reduce<Record<number, number>>((counts, line) => {
    counts[line.product_id] = (counts[line.product_id] ?? 0) + line.quantity
    return counts
  }, {})

  return (
    <div
      className={cn(
        "-m-6 flex flex-col overflow-hidden bg-surface",
        "h-[calc(100svh-var(--orders-rail-h,0px))]",
        "phone:-mx-4 phone:-mt-4 phone:mb-[calc(-1rem-var(--bottom-tabs-h))] phone:h-[calc(100svh-var(--bottom-tabs-h)-var(--orders-rail-h,0px))]",
        "phone-portrait:h-[calc(100svh-var(--bottom-tabs-h))] phone-portrait:[--orders-rail-h:0px]",
      )}
      style={{ "--orders-rail-h": "5.75rem" } as CSSProperties}
    >
      <OrdersQueueRail creating createTo="/pos" flush />
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-surface-elevated px-6 py-3 phone:px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faCashRegister} className="size-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide">POS</span>
          </div>
          <h1 className="truncate text-lg font-bold text-ink phone:text-base">Pedido WhatsApp</h1>
        </div>
        <Stepper step={step} onStep={setStep} />
      </header>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          if (step !== 3) {
            event.preventDefault()
            setStep(step === 1 ? 2 : 3)
            return
          }
          handleSubmit(event)
        }}
      >
        {step === 1 ? (
          <CustomerStep
            values={values}
            onChange={handleChange}
            onPhoneChange={(phone) => mutate({ customer_phone: phone })}
            onLocationChange={(latitude, longitude) => mutate({ latitude, longitude })}
            onContinue={() => setStep(2)}
          />
        ) : null}
        {step === 2 ? (
          <CatalogStep
            products={products}
            menus={menus}
            items={cart.items}
            addedCounts={addedCounts}
            subtotal={cart.subtotal}
            onAdd={handleAddProduct}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.remove}
            onContinue={() => setStep(3)}
          />
        ) : null}
        {step === 3 ? (
          <CheckoutStep
            values={values}
            items={cart.items}
            subtotal={cart.subtotal}
            total={total}
            maxDiscount={maxDiscount}
            discountError={discountTooHigh ? "El descuento no puede ser mayor al total" : ""}
            feeStatus={feeStatus}
            feeError={feeError}
            paymentError={paymentError}
            method={method}
            changeFor={changeFor}
            qrUrl={restaurant?.payment_qr_url}
            restaurantName={restaurant?.name}
            isSubmitting={isSubmitting}
            gaps={gaps}
            onChange={(e) => {
              if (e.target.name === "discount") {
                handleDiscountChange(e)
                return
              }
              handleChange(e)
            }}
            onMethodChange={(next) => {
              setMethod(next)
              setPaymentError("")
            }}
            onChangeFor={(value) => {
              setChangeFor(value)
              setPaymentError("")
            }}
            onFix={setStep}
            onBack={() => setStep(2)}
          />
        ) : null}
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

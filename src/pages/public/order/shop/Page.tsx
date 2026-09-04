import { useEffect, useState, type ReactNode } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { BrandLogo } from "../../../../components/atoms/BrandLogo"
import { useCart } from "../../../../hooks/useCart"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { TPublicCatalog, TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import type { TOrderItemForm, TOrderItemOption } from "../../../../types/OrderItem"
import type { TProduct } from "../../../../types/Product"
import { ProductList } from "../../../../utils/utils"
import { publicOrderPath } from "../../../../utils/orderShare"
import { resolveMediaUrl } from "../../../../utils/mediaUrl"
import { StatusCard } from "../complete/StatusCard"
import { ProductOptionsDialog } from "../../../dashboard/orders/new/ProductOptionsDialog"
import { CatalogStep } from "./CatalogStep"
import { CheckoutStep } from "./CheckoutStep"
import { PreviewStep } from "./PreviewStep"
import { Stepper, type TShopStep } from "./Stepper"

type TShopForm = TPublicOrderCompleteForm & {
  items_attributes: TOrderItemForm[]
  coupon_code: string
}

const initialValues: TShopForm = {
  items_attributes: [],
  coupon_code: "",
  name: "",
  phone: "",
  notes: "",
  latitude: null,
  longitude: null,
}

const PHONE_DIGITS = 8

const isBoliviaPhone = (value: string) => value.length === PHONE_DIGITS && /^\d+$/.test(value)

const toBoliviaPhone = (value: string) => `+591${value}`

const toMoney = (n: number) => Math.round(Number(n) * 100) / 100

const productHasOptions = (product: TProduct) =>
  (product.product_option_groups ?? []).some((group) =>
    (group.product_options ?? []).some((option) => option.active !== false),
  )

const errorMessage = (error: unknown, fallback = "No se pudo crear el pedido. Intenta de nuevo.") => {
  if (!axios.isAxiosError(error)) return fallback
  const body = error.response?.data?.error as string | string[] | undefined
  if (Array.isArray(body)) return body.join(", ")
  if (typeof body === "string" && body.trim()) return body
  return fallback
}

const copyFor = (step: TShopStep) => {
  if (step === 1) {
    return {
      title: "Arma tu pedido",
      description: "Elige tus productos y continúa para revisar el pedido.",
    }
  }
  if (step === 2) {
    return {
      title: "Revisa tu pedido",
      description: "Ajusta cantidades o quita productos antes de indicar la entrega.",
    }
  }
  return {
    title: "Tus datos",
    description: "Indica tu ubicación para calcular el envío. Si tienes un cupón Pedí2, escríbelo aquí.",
  }
}

export const Page = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const orderingToken = token?.trim() ?? ""
  const [catalog, setCatalog] = useState<TPublicCatalog | null>(null)
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">(
    orderingToken ? "loading" : "unavailable",
  )
  const [step, setStep] = useState<TShopStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [customizing, setCustomizing] = useState<TProduct | null>(null)
  const [customizeKey, setCustomizeKey] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [feeStatus, setFeeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [feeError, setFeeError] = useState("")
  const [couponApplied, setCouponApplied] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")

  const { values, handleChange, handleSubmit, mutate, setValues } = useForm<TShopForm>({
    initialValues,
    onSubmit: async (formValues) => {
      if (!orderingToken) return
      if (formValues.items_attributes.length === 0) {
        setError("Agrega al menos un producto.")
        setStep(1)
        return
      }
      if (!formValues.name.trim()) {
        setError("Completa tu nombre y teléfono.")
        return
      }
      if (!isBoliviaPhone(formValues.phone)) {
        setError("El teléfono debe tener 8 dígitos.")
        return
      }
      if (formValues.latitude == null || formValues.longitude == null) {
        setError("Necesitamos tu ubicación para la entrega.")
        return
      }

      const couponCode = formValues.coupon_code.replace(/\D/g, "").slice(0, 8)
      setError("")
      setIsSubmitting(true)
      try {
        const order = await apiClient.publicCatalog.createOrder(orderingToken, {
          customer_name: formValues.name.trim(),
          customer_phone: toBoliviaPhone(formValues.phone),
          notes: formValues.notes.trim(),
          latitude: formValues.latitude,
          longitude: formValues.longitude,
          ...(couponCode.length === 8 ? { coupon_code: couponCode } : {}),
          items: formValues.items_attributes.map((line) => ({
            product_id: line.product_id,
            quantity: line.quantity,
            order_item_options: (line.order_item_options ?? []).map((option) => ({
              option_group_name: option.option_group_name,
              option_name: option.option_name,
            })),
          })),
        })
        navigate(publicOrderPath(order.public_token), { replace: true })
      } catch (e) {
        setError(errorMessage(e))
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const cart = useCart({
    items: values.items_attributes,
    setItems: (updater) => {
      setValues((current) => ({
        ...current,
        items_attributes: updater(current.items_attributes),
      }))
    },
  })

  useEffect(() => {
    if (!orderingToken) return
    let cancelled = false

    const load = async () => {
      try {
        const next = await apiClient.publicCatalog.show(orderingToken)
        if (cancelled) return
        setCatalog(next)
        setLoadState("ready")
      } catch {
        if (!cancelled) setLoadState("unavailable")
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [orderingToken])

  useEffect(() => {
    if (values.latitude == null || values.longitude == null || !orderingToken) {
      setFeeStatus("idle")
      setFeeError("")
      setDeliveryFee(0)
      return
    }

    let cancelled = false
    setFeeStatus("loading")
    setFeeError("")

    void apiClient.publicCatalog
      .previewDelivery(orderingToken, values.latitude, values.longitude)
      .then((preview) => {
        if (cancelled) return
        setDeliveryFee(toMoney(preview.fee))
        setFeeStatus("ready")
      })
      .catch((error) => {
        if (cancelled) return
        setDeliveryFee(0)
        setFeeStatus("error")
        setFeeError(errorMessage(error, "No se pudo calcular el envío para esta ubicación."))
      })

    return () => {
      cancelled = true
    }
  }, [orderingToken, values.latitude, values.longitude])

  const couponCode = values.coupon_code.replace(/\D/g, "").slice(0, 8)

  useEffect(() => {
    if (couponCode.length !== 8 || !orderingToken) {
      setCouponApplied(0)
      setCouponError("")
      setCouponStatus("idle")
      return
    }

    let cancelled = false
    setCouponStatus("loading")
    setCouponError("")

    void apiClient.publicCatalog
      .previewCoupon(orderingToken, {
        code: couponCode,
        subtotal: cart.subtotal,
        delivery_fee: deliveryFee,
        discount: 0,
      })
      .then((quote) => {
        if (cancelled) return
        setCouponApplied(toMoney(Number(quote.applied_amount)))
        setCouponStatus("ready")
      })
      .catch((error) => {
        if (cancelled) return
        setCouponApplied(0)
        setCouponStatus("error")
        setCouponError(errorMessage(error, "No se pudo aplicar el cupón."))
      })

    return () => {
      cancelled = true
    }
  }, [orderingToken, couponCode, cart.subtotal, deliveryFee])

  const handleAddProduct = (product: TProduct) => {
    if (productHasOptions(product)) {
      setCustomizeKey((key) => key + 1)
      setCustomizing(product)
      return
    }
    cart.add(product)
  }

  const handleDecrement = (product: TProduct) => {
    const last = [...cart.items].reverse().find((line) => line.product_id === product.id)
    if (!last) return
    cart.updateQuantity(last.clientKey, last.quantity - 1)
  }

  const handleConfirmOptions = (options: TOrderItemOption[]) => {
    if (!customizing) return
    cart.add(customizing, options)
    setCustomizing(null)
  }

  const goToStep = (next: TShopStep) => {
    if (next !== 1 && cart.items.length === 0) return
    setError("")
    setStep(next)
  }

  if (!orderingToken || loadState === "unavailable") {
    return (
      <Shell>
        <StatusCard
          icon={faCircleExclamation}
          title="Menú no válido"
          description="Revisa el enlace e intenta de nuevo."
        />
      </Shell>
    )
  }

  if (loadState === "loading" || !catalog) {
    return (
      <Shell>
        <p className="text-center text-[15px] text-ink-muted">Cargando menú...</p>
      </Shell>
    )
  }

  const products = ProductList(catalog.menus)
  const addedCounts = cart.items.reduce<Record<number, number>>((counts, line) => {
    counts[line.product_id] = (counts[line.product_id] ?? 0) + line.quantity
    return counts
  }, {})
  const total = Math.max(0, cart.subtotal + deliveryFee - couponApplied)
  const copy = copyFor(step)
  const logoSrc = resolveMediaUrl(catalog.logo_url)

  return (
    <Shell>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt=""
              className="size-14 shrink-0 rounded-2xl border border-gray-200 bg-white object-cover"
            />
          ) : null}
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{catalog.name}</p>
        </div>
        <h1 className="mt-1 text-[1.75rem] font-bold leading-tight text-ink">{copy.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{copy.description}</p>
        <Stepper step={step} canPreview={cart.items.length > 0} onStep={goToStep} />
      </header>

      {step === 1 ? (
        <CatalogStep
          products={products}
          menus={catalog.menus}
          addedCounts={addedCounts}
          itemCount={cart.items.length}
          subtotal={cart.subtotal}
          onAdd={handleAddProduct}
          onDecrement={handleDecrement}
          onContinue={() => goToStep(2)}
        />
      ) : null}

      {step === 2 ? (
        <PreviewStep
          items={cart.items}
          subtotal={cart.subtotal}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.remove}
          onBack={() => goToStep(1)}
          onContinue={() => goToStep(3)}
        />
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="self-start text-sm font-medium text-ink-muted hover:text-brand"
            onClick={() => goToStep(2)}
          >
            ← Volver al pedido
          </button>
          <CheckoutStep
            values={values}
            isSubmitting={isSubmitting}
            error={error}
            couponCode={values.coupon_code}
            couponApplied={couponApplied}
            couponError={couponError}
            couponStatus={couponStatus}
            subtotal={cart.subtotal}
            deliveryFee={deliveryFee}
            feeStatus={feeStatus}
            feeError={feeError}
            total={total}
            onChange={handleChange}
            onPhoneChange={(phone) => mutate({ phone })}
            onLocationChange={(latitude, longitude) => mutate({ latitude, longitude })}
            onCouponChange={(code) => mutate({ coupon_code: code })}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}

      {customizing && (
        <ProductOptionsDialog
          key={customizeKey}
          product={customizing}
          onConfirm={handleConfirmOptions}
          onCancel={() => setCustomizing(null)}
        />
      )}
    </Shell>
  )
}

const Shell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-svh bg-surface px-4 py-8">
    <div className="mx-auto w-full max-w-lg">
      <BrandLogo className="mb-6 h-12" />
      {children}
    </div>
  </div>
)

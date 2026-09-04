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
import { cn } from "../../../../utils/format"
import { resolveMediaUrl } from "../../../../utils/mediaUrl"
import { CustomerForm } from "../complete/CustomerForm"
import { StatusCard } from "../complete/StatusCard"
import { ProductOptionsDialog } from "../../../dashboard/orders/new/ProductOptionsDialog"
import { CatalogStep } from "./CatalogStep"

type TShopForm = TPublicOrderCompleteForm & {
  items_attributes: TOrderItemForm[]
}

const initialValues: TShopForm = {
  items_attributes: [],
  name: "",
  phone: "",
  notes: "",
  latitude: null,
  longitude: null,
}

const PHONE_DIGITS = 8

const isBoliviaPhone = (value: string) => value.length === PHONE_DIGITS && /^\d+$/.test(value)

const toBoliviaPhone = (value: string) => `+591${value}`

const productHasOptions = (product: TProduct) =>
  (product.product_option_groups ?? []).some((group) =>
    (group.product_options ?? []).some((option) => option.active !== false),
  )

const errorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "No se pudo crear el pedido. Intenta de nuevo."
  const body = error.response?.data?.error as string | string[] | undefined
  if (Array.isArray(body)) return body.join(", ")
  if (typeof body === "string" && body.trim()) return body
  return "No se pudo crear el pedido. Intenta de nuevo."
}

export const Page = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const orderingToken = token?.trim() ?? ""
  const [catalog, setCatalog] = useState<TPublicCatalog | null>(null)
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">(
    orderingToken ? "loading" : "unavailable",
  )
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [customizing, setCustomizing] = useState<TProduct | null>(null)
  const [customizeKey, setCustomizeKey] = useState(0)

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

      setError("")
      setIsSubmitting(true)
      try {
        const order = await apiClient.publicCatalog.createOrder(orderingToken, {
          customer_name: formValues.name.trim(),
          customer_phone: toBoliviaPhone(formValues.phone),
          notes: formValues.notes.trim(),
          latitude: formValues.latitude,
          longitude: formValues.longitude,
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
        <h1 className="mt-1 text-[1.75rem] font-bold leading-tight text-ink">
          {step === 1 ? "Arma tu pedido" : "Tus datos"}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          {step === 1
            ? "Elige tus productos y continúa para indicar la entrega."
            : "Indica tu ubicación para calcular el envío."}
        </p>
        <ol className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <li>
            <button
              type="button"
              onClick={() => setStep(1)}
              className={cn(
                "rounded-full px-3 py-1.5 transition",
                step === 1 ? "bg-brand text-white" : "bg-gray-100 text-ink hover:bg-gray-200",
              )}
            >
              1. Pedido
            </button>
          </li>
          <li className="text-gray-300" aria-hidden>
            →
          </li>
          <li>
            <button
              type="button"
              disabled={cart.items.length === 0}
              onClick={() => setStep(2)}
              className={cn(
                "rounded-full px-3 py-1.5 transition disabled:cursor-not-allowed disabled:opacity-50",
                step === 2 ? "bg-brand text-white" : "bg-gray-100 text-ink hover:bg-gray-200",
              )}
            >
              2. Datos
            </button>
          </li>
        </ol>
      </header>

      {step === 1 ? (
        <CatalogStep
          products={products}
          menus={catalog.menus}
          items={cart.items}
          addedCounts={addedCounts}
          subtotal={cart.subtotal}
          onAdd={handleAddProduct}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.remove}
          onContinue={() => setStep(2)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="self-start text-sm font-medium text-ink-muted hover:text-brand"
            onClick={() => setStep(1)}
          >
            ← Volver al pedido
          </button>
          <CustomerForm
            values={values}
            isSubmitting={isSubmitting}
            error={error}
            onChange={handleChange}
            onPhoneChange={(phone) => mutate({ phone })}
            onLocationChange={(latitude, longitude) => mutate({ latitude, longitude })}
            onSubmit={handleSubmit}
          />
        </div>
      )}

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

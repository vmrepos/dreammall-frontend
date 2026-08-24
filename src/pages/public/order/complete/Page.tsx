import { useEffect, useState, type ReactNode } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { BrandLogo } from "../../../../components/atoms/BrandLogo"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { TPublicOrder, TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import { CustomerForm } from "./CustomerForm"
import { PayStep } from "./PayStep"
import { StatusCard } from "./StatusCard"
import { SummaryStep } from "./SummaryStep"

const initialValues: TPublicOrderCompleteForm = {
  name: "",
  phone: "",
  notes: "",
  latitude: null,
  longitude: null,
}

const PHONE_DIGITS = 8
const PAY_POLL_MS = 4000

const isBoliviaPhone = (value: string) => value.length === PHONE_DIGITS && /^\d+$/.test(value)

const toBoliviaPhone = (value: string) => `+591${value}`

const errorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "No se pudieron enviar tus datos. Intenta de nuevo."
  const body = error.response?.data?.error as string | string[] | undefined
  if (Array.isArray(body)) return body.join(", ")
  if (typeof body === "string" && body.trim()) return body
  return "No se pudieron enviar tus datos. Intenta de nuevo."
}

const orderHasCustomerData = (order: TPublicOrder) => Boolean(order.customer_name?.trim())

/** Kitchen confirmed payment / started cooking — reveal summary + delivery code. */
const kitchenStarted = (order: TPublicOrder) =>
  Boolean(order.status) && order.status !== "pending"


type Step = "details" | "pay" | "confirmed"

const stepForOrder = (order: TPublicOrder | null): Step => {
  if (!order || !orderHasCustomerData(order)) return "details"
  if (kitchenStarted(order)) return "confirmed"
  return "pay"
}

export const Page = () => {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const fromRestaurant =
    searchParams.get("from_restaurant") === "true" || searchParams.get("from_restaurant") === "1"
  const publicToken = token?.trim() ?? ""
  const [preview, setPreview] = useState<TPublicOrder | null>(null)
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">(
    publicToken ? "loading" : "unavailable",
  )
  const [step, setStep] = useState<Step>("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { values, handleChange, handleSubmit, mutate } = useForm<TPublicOrderCompleteForm>({
    initialValues,
    onSubmit: async (formValues) => {
      if (!publicToken) return
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
        const quoted = await apiClient.publicOrders.complete(publicToken, {
          customer_name: formValues.name.trim(),
          customer_phone: toBoliviaPhone(formValues.phone),
          notes: formValues.notes.trim(),
          latitude: formValues.latitude,
          longitude: formValues.longitude,
        })
        setPreview(quoted)
        setStep(stepForOrder(quoted))
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setLoadState("unavailable")
          return
        }
        setError(errorMessage(e))
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (!publicToken) return
    let cancelled = false

    const load = async () => {
      try {
        const order = await apiClient.publicOrders.show(publicToken)
        if (cancelled) return
        setPreview(order)
        setStep(stepForOrder(order))
        setLoadState("ready")
      } catch {
        if (!cancelled) setLoadState("unavailable")
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [publicToken])

  // Poll while waiting for kitchen to mark preparing — no public Action Cable.
  useEffect(() => {
    if (!publicToken || step !== "pay") return
    let cancelled = false

    const poll = async () => {
      try {
        const order = await apiClient.publicOrders.show(publicToken)
        if (cancelled) return
        setPreview(order)
        if (kitchenStarted(order)) setStep("confirmed")
      } catch {
        // Keep waiting; transient errors should not kick the customer off pay.
      }
    }

    const id = window.setInterval(() => {
      void poll()
    }, PAY_POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [publicToken, step])

  if (!publicToken || loadState === "unavailable") {
    return (
      <Shell>
        <StatusCard
          icon={faCircleExclamation}
          title="Pedido no válido"
          description="Revisa el enlace e intenta de nuevo."
        />
      </Shell>
    )
  }

  if (loadState === "loading") {
    return (
      <Shell>
        <p className="text-center text-[15px] text-ink-muted">Cargando pedido...</p>
      </Shell>
    )
  }

  const orderLabel = preview ? `Pedido #${preview.id}` : "tu pedido"
  const title =
    step === "details"
      ? fromRestaurant
        ? "Completar ubicación"
        : "Completa tu pedido"
      : step === "pay"
        ? "Paga tu pedido"
        : "Tu pedido"
  const subtitle =
    step === "details"
      ? fromRestaurant
        ? "Marca el destino en el mapa. No uses la ubicación de este dispositivo."
        : "Indica tu ubicación para calcular el envío."
      : step === "pay"
        ? "Transfiere con el QR. El resumen y el código aparecen cuando el comercio confirme el pago."
        : "Guarda el código de entrega para dárselo al repartidor."

  return (
    <Shell>
      <header className="mb-6">
        <h1 className="text-[1.75rem] font-bold leading-tight text-brand">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          {preview ? `${orderLabel}. ` : null}
          {subtitle}
        </p>
      </header>

      {step === "confirmed" && preview ? (
        <SummaryStep order={preview} />
      ) : step === "pay" && preview ? (
        <PayStep order={preview} />
      ) : (
        <CustomerForm
          values={values}
          isSubmitting={isSubmitting}
          error={error}
          onChange={handleChange}
          onPhoneChange={(phone) => mutate({ phone })}
          onLocationChange={(latitude, longitude) => mutate({ latitude, longitude })}
          onSubmit={handleSubmit}
          fromRestaurant={fromRestaurant}
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

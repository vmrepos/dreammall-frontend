import { useEffect, useState, type ReactNode } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import { faArrowLeft, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BrandLogo } from "../../../../components/atoms/BrandLogo"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { TPaymentMethod } from "../../../../types/Order"
import type { TPublicOrder, TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import { isPaymentMethod } from "../../../../utils/payment"
import { CustomerForm } from "./CustomerForm"
import { PayStep } from "./PayStep"
import { StatusCard } from "./StatusCard"
import { SummaryStep } from "./SummaryStep"
import { WaitingStep } from "./WaitingStep"

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

type Step = "details" | "pay" | "waiting" | "confirmed"

const stepForOrder = (order: TPublicOrder | null): Step => {
  if (!order || !orderHasCustomerData(order)) return "details"
  if (kitchenStarted(order)) return "confirmed"
  if (isPaymentMethod(order.payment_method)) return "waiting"
  return "pay"
}

export const Page = () => {
  const navigate = useNavigate()
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
  const [method, setMethod] = useState<TPaymentMethod>("qr")
  const [changeFor, setChangeFor] = useState("")

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
          ...(fromRestaurant ? { from_restaurant: true } : {}),
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

  const confirmPayment = async () => {
    if (!publicToken) return
    if (method === "cash") {
      const bill = Number(changeFor)
      const total = Number(preview?.total_amount ?? 0)
      if (!Number.isFinite(bill) || bill <= 0) {
        setError("Indica de qué billete necesitas cambio.")
        return
      }
      if (bill < total) {
        setError("El billete debe cubrir el total.")
        return
      }
    }
    setError("")
    setIsSubmitting(true)
    try {
      const quoted = await apiClient.publicOrders.complete(publicToken, {
        payment_method: method,
        change_for: method === "cash" ? Number(changeFor) : null,
        ...(fromRestaurant ? { from_restaurant: true } : {}),
      })
      setPreview(quoted)
      if (fromRestaurant) {
        navigate(`/orders/${quoted.id}`, { replace: true })
        return
      }
      setStep("waiting")
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        setLoadState("unavailable")
        return
      }
      setError(errorMessage(e))
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!publicToken) return
    let cancelled = false

    const load = async () => {
      try {
        const order = await apiClient.publicOrders.show(publicToken)
        if (cancelled) return
        setPreview(order)
        if (fromRestaurant && isPaymentMethod(order.payment_method)) {
          navigate(`/orders/${order.id}`, { replace: true })
          return
        }
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
  }, [publicToken, fromRestaurant, navigate])

  useEffect(() => {
    if (!publicToken || step !== "waiting") return
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
        ? "¿Cómo vas a pagar?"
        : step === "waiting"
          ? "Esperando confirmación del comercio"
          : "Tu pedido"
  const subtitle =
    step === "details"
      ? fromRestaurant
        ? "Marca el destino en el mapa. No uses la ubicación de este dispositivo."
        : "Indica tu ubicación para calcular el envío."
      : step === "pay"
        ? fromRestaurant
          ? "Elige efectivo o QR. Al confirmar, volvemos al pedido."
          : "Elige efectivo o QR. El comercio confirma y empieza a preparar."
        : step === "waiting"
          ? "Te avisamos aquí cuando el comercio confirme."
          : "Guarda el código de entrega para dárselo al repartidor."

  return (
    <Shell>
      <header className="mb-6">
        {fromRestaurant && preview ? (
          <Link
            to={`/orders/${preview.id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-brand"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
            Volver al pedido
          </Link>
        ) : null}
        <h1 className="text-[1.75rem] font-bold leading-tight text-brand">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          {preview ? `${orderLabel}. ` : null}
          {subtitle}
        </p>
      </header>

      {step === "confirmed" && preview ? (
        <SummaryStep order={preview} />
      ) : step === "waiting" && preview ? (
        <WaitingStep order={preview} />
      ) : step === "pay" && preview ? (
        <PayStep
          order={preview}
          method={method}
          changeFor={changeFor}
          error={error}
          isSubmitting={isSubmitting}
          onMethodChange={(next) => {
            setMethod(next)
            setError("")
          }}
          onChangeFor={setChangeFor}
          onConfirm={() => void confirmPayment()}
        />
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

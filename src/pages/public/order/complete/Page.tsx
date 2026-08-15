import { useEffect, useState, type ReactNode } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { BrandLogo } from "../../../../components/atoms/BrandLogo"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { TPublicOrder, TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import { CustomerForm } from "./CustomerForm"
import { OrderPreview } from "./OrderPreview"

const initialValues: TPublicOrderCompleteForm = {
  name: "",
  phone: "",
  latitude: null,
  longitude: null,
}

const PHONE_DIGITS = 8

const isBoliviaPhone = (value: string) => value.length === PHONE_DIGITS && /^\d+$/.test(value)

const toBoliviaPhone = (value: string) => `+591${value}`

const errorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "No se pudieron enviar tus datos. Intenta de nuevo."
  const body = error.response?.data?.error as string | string[] | undefined
  if (Array.isArray(body)) return body.join(", ")
  if (typeof body === "string" && body.trim()) return body
  return "No se pudieron enviar tus datos. Intenta de nuevo."
}

export const Page = () => {
  const { token } = useParams()
  const publicToken = token?.trim() ?? ""
  const [preview, setPreview] = useState<TPublicOrder | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
        await apiClient.publicOrders.complete(publicToken, {
          customer_name: formValues.name.trim(),
          customer_phone: toBoliviaPhone(formValues.phone),
          latitude: formValues.latitude,
          longitude: formValues.longitude,
        })
        setSubmitted(true)
      } catch (e) {
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
        if (!cancelled) setPreview(order)
      } catch {
        if (!cancelled) setPreview(null)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [publicToken])

  if (!publicToken) {
    return (
      <Shell>
        <h1 className="text-[1.75rem] font-bold leading-tight text-brand">Pedido no válido</h1>
        <p className="mt-2 text-[15px] text-ink-muted">Revisa el enlace e intenta de nuevo.</p>
      </Shell>
    )
  }

  const orderLabel = preview ? `Pedido #${preview.id}` : "tu pedido"

  if (submitted) {
    return (
      <Shell>
        <div className="rounded-[20px] border border-gray-200/80 bg-surface-elevated p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(12,107,61,0.06)]">
          <FontAwesomeIcon icon={faCircleCheck} className="size-12 text-brand" aria-hidden />
          <h1 className="mt-4 text-[1.75rem] font-bold leading-tight text-brand">
            Datos enviados
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            El comercio ya tiene tu nombre, teléfono y ubicación para {orderLabel}.
          </p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <header className="mb-6">
        <h1 className="text-[1.75rem] font-bold leading-tight text-brand">
          Completa tu pedido
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          {preview ? `${orderLabel}. ` : null}
          Confirma tus datos para la entrega.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {preview && preview.items.length > 0 ? <OrderPreview order={preview} /> : null}
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

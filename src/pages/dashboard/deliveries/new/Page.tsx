import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faTruck } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog"
import { useForm } from "../../../../hooks/useForm"
import { useOrders } from "../../../../context/OrdersContext"
import { apiClient } from "../../../../services/apiClient"
import type { DeliveryPreview } from "../../../../services/deliveries"
import { CourierForm, type TCourierFormValues } from "./CourierForm"

const initialValues: TCourierFormValues = {
  customer_name: "",
  customer_phone: "",
  notes: "",
  latitude: null,
  longitude: null,
}

export const Page = () => {
  const navigate = useNavigate()
  const { createOrder, markPreparing } = useOrders()
  const [preview, setPreview] = useState<DeliveryPreview | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { values, handleChange, mutate } = useForm<TCourierFormValues>({
    initialValues,
    onSubmit: () => undefined,
  })

  const calculatePreview = async () => {
    if (values.latitude == null || values.longitude == null) return

    setIsCalculating(true)
    try {
      const data = await apiClient.deliveries.preview(values.latitude, values.longitude)
      setPreview(data)
    } catch {
      setPreview(null)
      toast.error("No se pudo calcular la tarifa")
    } finally {
      setIsCalculating(false)
    }
  }

  const createDelivery = async () => {
    if (preview == null || values.latitude == null || values.longitude == null) return

    setIsCreating(true)
    try {
      const order = await createOrder({
        items_attributes: [],
        delivery_fee: Number(preview.fee),
        discount: 0,
        notes: values.notes.trim(),
        latitude: values.latitude,
        longitude: values.longitude,
        distance_km: Number(preview.distance_km),
        customer_name: values.customer_name.trim(),
        customer_phone: values.customer_phone.trim(),
      })
      const preparing = await markPreparing(order.id)
      toast.success("Buscando un repartidor")
      const deliveryId = preparing.delivery?.id
      navigate(deliveryId ? `/deliveries/${deliveryId}` : `/orders/${order.id}`)
    } catch {
      toast.error("No se pudo crear la entrega.")
    } finally {
      setIsCreating(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/deliveries"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a entregas
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-brand">
          <FontAwesomeIcon icon={faTruck} className="size-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wide">Nueva entrega</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitar entrega</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Envía un paquete sin armar un pedido de comida. Al confirmar, Pedí2 busca
          un repartidor. Cuando el paquete esté empacado, márcalo listo en la entrega.
        </p>
      </div>

      <CourierForm
        values={values}
        preview={preview}
        isCalculating={isCalculating}
        isCreating={isCreating}
        onChange={handleChange}
        onPinChange={(latitude, longitude) => {
          mutate({ latitude, longitude })
          setPreview(null)
        }}
        onCalculate={() => void calculatePreview()}
        onCancel={() => navigate("/deliveries")}
        onConfirm={() => setShowConfirm(true)}
      />

      <ConfirmDialog
        open={showConfirm}
        title="Confirmar entrega"
        message="Pedí2 buscará un repartidor. ¿Deseas continuar?"
        confirmLabel="Sí, solicitar"
        confirmVariant="primary"
        confirming={isCreating}
        onConfirm={() => void createDelivery()}
        onCancel={() => !isCreating && setShowConfirm(false)}
      />
    </div>
  )
}

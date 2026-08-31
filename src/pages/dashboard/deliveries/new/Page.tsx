import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faTruck } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog"
import { useForm } from "../../../../hooks/useForm"
import { apiClient } from "../../../../services/apiClient"
import type { ShipmentPreview } from "../../../../services/shipments"
import type { TShipmentFormValues } from "../../../../types/Shipment"
import type { TAddressSelection } from "../../../../components/molecules/AddressSearchField"
import { CourierForm } from "./CourierForm"

const initialValues: TShipmentFormValues = {
  pickup_name: "",
  pickup_phone: "",
  pickup_address: "",
  pickup_latitude: null,
  pickup_longitude: null,
  recipient_name: "",
  recipient_phone: "",
  destination_address: "",
  destination_latitude: null,
  destination_longitude: null,
  description: "",
}

export const Page = () => {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<ShipmentPreview | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { values, handleChange, mutate } = useForm<TShipmentFormValues>({
    initialValues,
    onSubmit: () => undefined,
  })

  const calculatePreview = async () => {
    if (
      values.pickup_latitude == null ||
      values.pickup_longitude == null ||
      values.destination_latitude == null ||
      values.destination_longitude == null
    ) return

    setIsCalculating(true)
    try {
      const data = await apiClient.shipments.preview(values)
      setPreview(data)
    } catch {
      setPreview(null)
      toast.error("No se pudo calcular la tarifa")
    } finally {
      setIsCalculating(false)
    }
  }

  const createDelivery = async () => {
    if (preview == null) return

    setIsCreating(true)
    try {
      const delivery = await apiClient.shipments.create(values)
      toast.success("Buscando un repartidor")
      navigate(`/deliveries/${delivery.id}`)
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
            un repartidor y lo enviará a recoger el paquete.
        </p>
      </div>

      <CourierForm
        values={values}
        preview={preview}
        isCalculating={isCalculating}
        isCreating={isCreating}
        onChange={handleChange}
        onPickupAddressSelect={(selection: TAddressSelection) => {
          mutate({
            pickup_address: selection.address,
            pickup_latitude: selection.latitude,
            pickup_longitude: selection.longitude,
          })
          setPreview(null)
        }}
        onDestinationAddressSelect={(selection: TAddressSelection) => {
          mutate({
            destination_address: selection.address,
            destination_latitude: selection.latitude,
            destination_longitude: selection.longitude,
          })
          setPreview(null)
        }}
        onPickupAddressChange={(pickup_address) => {
          mutate({ pickup_address })
          setPreview(null)
        }}
        onDestinationAddressChange={(destination_address) => {
          mutate({ destination_address })
          setPreview(null)
        }}
        onPickupCoordinatesChange={(pickup_latitude, pickup_longitude) => {
          mutate({ pickup_latitude, pickup_longitude })
          setPreview(null)
        }}
        onDestinationCoordinatesChange={(destination_latitude, destination_longitude) => {
          mutate({ destination_latitude, destination_longitude })
          setPreview(null)
        }}
        onCalculate={() => void calculatePreview()}
        onCancel={() => navigate("/deliveries")}
        onConfirm={() => setShowConfirm(true)}
      />

      <ConfirmDialog
        open={showConfirm}
        title="Confirmar entrega"
        message="Pedí2 buscará un repartidor para recoger el paquete. ¿Deseas continuar?"
        confirmLabel="Sí, solicitar"
        confirmVariant="primary"
        confirming={isCreating}
        onConfirm={() => void createDelivery()}
        onCancel={() => !isCreating && setShowConfirm(false)}
      />
    </div>
  )
}

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faLocationDot, faTruck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { FormField } from "../../../components/molecules/FormField"

import { formatCurrency } from "../../../utils/format"

export const DeliveryCreatePage = () => {
  const navigate = useNavigate()
  const [address, setAddress] = useState("")
  const [preview, setPreview] = useState<{ fee: string; distance_km: string } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const calculatePreview = async () => {
    if (!address.trim()) return

    setIsCalculating(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    setIsCalculating(false)
  }

  const createDelivery = async () => {
    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsCreating(false)
    navigate("/deliveries/301")
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
          Ingresa la dirección de destino para calcular el costo antes de confirmar.
        </p>
      </div>

      <Card padding="lg">
        <FormField
          id="address"
          label="Dirección de entrega"
          icon={faLocationDot}
          placeholder="Ej. Av. Busch 742, Santa Cruz"
          value={address}
          onChange={(ev) => {
            setAddress(ev.target.value)
            setPreview(null)
          }}
        />

        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            onClick={calculatePreview}
            disabled={!address.trim() || isCalculating}
          >
            {isCalculating ? "Calculando..." : "Calcular tarifa"}
          </Button>
        </div>

        {preview && (
          <div className="mt-8 rounded-xl bg-brand-light p-5">
            <h2 className="text-sm font-bold text-brand">Vista previa de tarifa</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Distancia estimada</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{preview.distance_km} km</dd>
              </div>
              <div>
                <dt className="text-gray-500">Costo de envío</dt>
                <dd className="mt-1 text-lg font-semibold text-brand">
                  {formatCurrency(preview.fee)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-gray-500">
              Dirección: {address}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
          <Button variant="secondary" onClick={() => navigate("/deliveries")}>
            Cancelar
          </Button>
          <Button onClick={createDelivery} disabled={!preview || isCreating}>
            {isCreating ? "Creando..." : "Confirmar entrega"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

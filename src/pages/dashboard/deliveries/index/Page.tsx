import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTruck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { EmptyList } from "../../../../components/molecules/EmptyList"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { useSubscription } from "../../../../context/SubscriptionContext"
import { apiClient } from "../../../../services/apiClient"
import type { TDelivery } from "../../../../types/Delivery"
import { DeliveriesTable } from "./DeliveriesTable"

export const Page = () => {
  const navigate = useNavigate()
  const { credits } = useSubscription()
  const [deliveries, setDeliveries] = useState<TDelivery[]>([])

  useEffect(() => {
    void apiClient.deliveries.list().then(setDeliveries)
  }, [])

  const canCreate = credits > 0

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={faTruck}
        section="Logística"
        title="Entregas"
        description="Sigue los viajes de tus pedidos y solicita un envío sin productos del menú."
        action={
          <Button onClick={() => navigate("/deliveries/new")} disabled={!canCreate}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nueva entrega
          </Button>
        }
      />

      {!canCreate ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          No te quedan entregas. Recarga créditos en Mi suscripción para solicitar un envío.
        </p>
      ) : null}

      <Card>
        {deliveries.length === 0 ? (
          <EmptyList
            icon={faTruck}
            title="Sin entregas todavía"
            description="Cuando marques Preparando en un pedido, o solicites un envío, aparecerá aquí."
            actionUrl="/deliveries/new"
            actionText="Crear primera entrega"
          />
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{deliveries.length}</span>{" "}
                {deliveries.length === 1 ? "entrega" : "entregas"}
              </p>
            </div>
            <DeliveriesTable deliveries={deliveries} />
          </>
        )}
      </Card>
    </div>
  )
}

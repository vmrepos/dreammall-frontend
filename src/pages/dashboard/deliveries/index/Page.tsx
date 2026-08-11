import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTruck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { EmptyList } from "../../../../components/molecules/EmptyList"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { apiClient } from "../../../../services/apiClient"
import type { TDelivery } from "../../../../types/Delivery"
import { DeliveriesTable } from "./DeliveriesTable"

export const Page = () => {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState<TDelivery[]>([])

  useEffect(() => {
    void apiClient.deliveries.list().then(setDeliveries)
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={faTruck}
        section="Logística"
        title="Entregas"
        description="Coordina y sigue el estado de las entregas de tu comercio."
        action={
          <Button onClick={() => navigate("/deliveries/new")}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nueva entrega
          </Button>
        }
      />

      <Card>
        {deliveries.length === 0 ? (
          <EmptyList
            icon={faTruck}
            title="Sin entregas todavía"
            description="Cuando solicites una entrega, aparecerá aquí con su estado y detalles."
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

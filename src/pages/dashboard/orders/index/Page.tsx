import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { EmptyList } from "../../../../components/molecules/EmptyList"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { useOrders } from "../../../../context/OrdersContext"
import { orderStatusConfig } from "../../../../utils/status"
import { OrderCard } from "../shared/OrderCard"
import { StatusFilters } from "./StatusFilters"
import type { StatusFilter } from "./statusFilters"

export const Page = () => {
  const navigate = useNavigate()
  const { orders } = useOrders()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending")

  const counts: Record<StatusFilter, number> = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    ready: orders.filter((order) => order.status === "ready").length,
    dispatched: orders.filter((order) => order.status === "dispatched").length,
    returned: orders.filter((order) => order.status === "returned").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
    completed: orders.filter((order) => order.status === "completed").length,
  }

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter)

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2">
      <PageHeader
        icon={faClipboardList}
        section="Logística"
        title="Pedidos"
        description="Gestiona pedidos entrantes, prepáralos y márcalos listos para entrega."
        action={
          <Button onClick={() => navigate("/orders/new")}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nuevo pedido
          </Button>
        }
      />

      {orders.length === 0 ? (
        <Card>
          <EmptyList
            icon={faClipboardList}
            title="Sin pedidos todavía"
            description="Crea un pedido manual para verlo aquí con estado, ítems y total."
            actionUrl="/orders/new"
            actionText="Crear primer pedido"
          />
        </Card>
      ) : (
        <>
          <StatusFilters value={statusFilter} counts={counts} onChange={setStatusFilter} />

          {filteredOrders.length === 0 ? (
            <p className="rounded-[20px] border border-dashed border-gray-200 bg-surface-elevated px-6 py-12 text-center text-sm text-ink-muted">
              No hay pedidos con este estado.
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-muted">
                <span className="font-semibold text-ink">{filteredOrders.length}</span>{" "}
                {filteredOrders.length === 1 ? "pedido" : "pedidos"}
                {statusFilter !== "all" && (
                  <span>
                    {" "}
                    · {orderStatusConfig[statusFilter].label.toLowerCase()}
                  </span>
                )}
              </p>

              <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

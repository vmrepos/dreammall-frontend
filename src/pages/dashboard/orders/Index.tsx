import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useOrders } from "../../../context/OrdersContext"
import type { TOrderStatus } from "../../../types/Order"
import { orderStatusConfig } from "../../../utils/status"
import { cn } from "../../../utils/format"
import { OrderCard, OrdersEmptyState } from "./OrderCard"

type StatusFilter = "all" | TOrderStatus

const filters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pending", label: orderStatusConfig.pending.label },
  { id: "ready", label: orderStatusConfig.ready.label },
  { id: "cancelled", label: orderStatusConfig.cancelled.label },
]

export const Index = () => {
  const navigate = useNavigate()
  const { orders } = useOrders()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const counts: Record<StatusFilter, number> = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    ready: orders.filter((order) => order.status === "ready").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
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
        <OrdersEmptyState onCreate={() => navigate("/orders/new")} />
      ) : (
        <>
          <div
            className="mb-4 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filtrar por estado"
          >
            {filters.map((filter) => {
              const active = statusFilter === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(filter.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                    active
                      ? "border-brand bg-brand text-white"
                      : "border-gray-200 bg-surface-elevated text-ink-muted hover:border-gray-300 hover:text-ink",
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-gray-100 text-ink-muted",
                    )}
                  >
                    {counts[filter.id]}
                  </span>
                </button>
              )
            })}
          </div>

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

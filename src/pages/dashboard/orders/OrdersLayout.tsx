import { useEffect, type CSSProperties } from "react"
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom"
import { useOrders } from "../../../context/OrdersContext"
import { OrderQueueBar } from "./shared/OrderQueueBar"
import { sortQueueOrders } from "./shared/orderQueue"

export const OrdersLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const showMatch = useMatch("/orders/:id")
  const { orders, attentionOrderIds, acknowledgeOrder } = useOrders()

  const creating = pathname.endsWith("/orders/new")
  const parsedId = Number(showMatch?.params.id)
  const activeOrderId = !creating && Number.isFinite(parsedId) ? parsedId : null
  const queue = sortQueueOrders(orders, attentionOrderIds)

  useEffect(() => {
    if (activeOrderId == null) return
    if (attentionOrderIds.includes(activeOrderId)) acknowledgeOrder(activeOrderId)
  }, [activeOrderId, attentionOrderIds, acknowledgeOrder])

  return (
    <div
      className="pb-24"
      style={{ "--orders-rail-h": "5.75rem" } as CSSProperties}
    >
      <Outlet />
      <OrderQueueBar
        orders={queue}
        attentionOrderIds={attentionOrderIds}
        activeOrderId={activeOrderId}
        creating={creating}
        onSelect={(orderId) => navigate(`/orders/${orderId}`)}
        onCreate={() => navigate("/orders/new")}
      />
    </div>
  )
}

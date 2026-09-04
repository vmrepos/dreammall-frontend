import { useEffect } from "react"
import { useMatch, useNavigate } from "react-router-dom"
import { useOrders } from "../../../../context/OrdersContext"
import { OrderQueueBar } from "./OrderQueueBar"
import { sortQueueOrders } from "./orderQueue"

type Props = {
  creating?: boolean
  createTo?: string
  flush?: boolean
}

export const OrdersQueueRail = ({
  creating = false,
  createTo = "/orders/new",
  flush = false,
}: Props) => {
  const navigate = useNavigate()
  const showMatch = useMatch("/orders/:id")
  const { orders, attentionOrderIds, acknowledgeOrder } = useOrders()
  const parsedId = Number(showMatch?.params.id)
  const activeOrderId = !creating && Number.isFinite(parsedId) ? parsedId : null
  const queue = sortQueueOrders(orders, attentionOrderIds)

  useEffect(() => {
    if (activeOrderId == null) return
    if (attentionOrderIds.includes(activeOrderId)) acknowledgeOrder(activeOrderId)
  }, [activeOrderId, attentionOrderIds, acknowledgeOrder])

  return (
    <OrderQueueBar
      orders={queue}
      attentionOrderIds={attentionOrderIds}
      activeOrderId={activeOrderId}
      creating={creating}
      flush={flush}
      onSelect={(orderId) => navigate(`/orders/${orderId}`)}
      onCreate={() => navigate(createTo)}
    />
  )
}

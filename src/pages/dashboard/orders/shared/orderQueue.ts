import type { TOrder, TOrderStatus } from "../../../../types/Order"

const QUEUE_STATUSES: TOrderStatus[] = ["pending", "preparing", "ready", "returned"]

export const isQueueOrder = (order: TOrder) => QUEUE_STATUSES.includes(order.status)

export const orderHasLocation = (order: TOrder) =>
  order.latitude != null && order.longitude != null

export const orderWaitingForCustomer = (order: TOrder) =>
  isQueueOrder(order) && !orderHasLocation(order)

export const sortQueueOrders = (orders: TOrder[], attentionIds: number[]) => {
  const attention = new Set(attentionIds)

  return orders.filter(isQueueOrder).sort((a, b) => {
    const attentionDelta = Number(attention.has(b.id)) - Number(attention.has(a.id))
    if (attentionDelta !== 0) return attentionDelta

    const waitingDelta =
      Number(orderWaitingForCustomer(b)) - Number(orderWaitingForCustomer(a))
    if (waitingDelta !== 0) return waitingDelta

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

import { type CSSProperties } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { OrdersQueueRail } from "./shared/OrdersQueueRail"

export const OrdersLayout = () => {
  const { pathname } = useLocation()
  const creating = pathname.endsWith("/orders/new")

  return (
    <div
      className="pb-[var(--orders-rail-h)] phone-portrait:pb-0 phone-portrait:[--orders-rail-h:0px]"
      style={{ "--orders-rail-h": "5.75rem" } as CSSProperties}
    >
      <OrdersQueueRail creating={creating} />
      <Outlet />
    </div>
  )
}

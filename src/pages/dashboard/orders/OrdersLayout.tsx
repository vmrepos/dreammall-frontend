import { type CSSProperties } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { OrdersQueueRail } from "./shared/OrdersQueueRail"

export const OrdersLayout = () => {
  const { pathname } = useLocation()
  const creating = pathname.endsWith("/r/orders/new")

  return (
    <div
      className="pb-[var(--orders-rail-h)] phone:flex phone:h-full phone:min-h-0 phone:flex-col phone-portrait:pb-0"
      style={{ "--orders-rail-h": "5.75rem" } as CSSProperties}
    >
      <OrdersQueueRail creating={creating} />
      <div className="phone:min-h-0 phone:flex-1">
        <Outlet />
      </div>
    </div>
  )
}

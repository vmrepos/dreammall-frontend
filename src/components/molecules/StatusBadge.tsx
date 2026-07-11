import { Badge } from "../atoms/Badge"
import { deliveryStatusConfig, orderStatusConfig } from "../../utils/status"
import type { TDeliveryStatus } from "../../types/Delivery"
import type { TOrderStatus } from "../../types/Order"

export const OrderStatusBadge = ({ status }: { status: TOrderStatus }) => {
  const config = orderStatusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const DeliveryStatusBadge = ({ status }: { status: TDeliveryStatus }) => {
  const config = deliveryStatusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

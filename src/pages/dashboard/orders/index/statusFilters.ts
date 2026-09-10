import type { TOrderStatus } from "../../../../types/Order"
import { orderStatusConfig } from "../../../../utils/status"

export type StatusFilter = "all" | Exclude<TOrderStatus, "completed" | "cancelled">

export const orderStatusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pending", label: orderStatusConfig.pending.label },
  { id: "preparing", label: orderStatusConfig.preparing.label },
  { id: "ready", label: orderStatusConfig.ready.label },
  { id: "dispatched", label: orderStatusConfig.dispatched.label },
  { id: "returned", label: orderStatusConfig.returned.label },
]

import { useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useRestaurant } from "../../../../context/RestaurantContext"
import { usePrepProgress } from "../../../../hooks/usePrepProgress"
import type { TOrder } from "../../../../types/Order"
import { cn, formatPrepClock } from "../../../../utils/format"
import { prepStoplightText } from "../../../../utils/prepStoplight"
import { orderStatusConfig } from "../../../../utils/status"
import { orderHasLocation, orderWaitingForCustomer } from "./orderQueue"
import { OrderQueueLinkMenu } from "./OrderQueueLinkMenu"
import { PrepTimeFill } from "./PrepTimeFill"

type Props = {
  orders: TOrder[]
  attentionOrderIds: number[]
  activeOrderId: number | null
  creating: boolean
  onSelect: (id: number) => void
  onCreate: () => void
}

export const OrderQueueBar = ({
  orders,
  attentionOrderIds,
  activeOrderId,
  creating,
  onSelect,
  onCreate,
}: Props) => {
  const attention = new Set(attentionOrderIds)

  return (
    <div
      className={cn(
        "z-40 border-gray-200 bg-surface-elevated/95 backdrop-blur-sm",
        "fixed inset-x-0 bottom-[var(--bottom-tabs-h,0px)] left-64 border-t",
        "phone:left-0",
        "phone-portrait:sticky phone-portrait:top-0 phone-portrait:bottom-auto phone-portrait:left-0 phone-portrait:z-30",
        "phone-portrait:border-t-0 phone-portrait:border-b phone-portrait:-mx-4 phone-portrait:-mt-4",
      )}
    >
      <div className="flex items-stretch gap-2 overflow-x-auto px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] phone:pb-2 phone-portrait:px-4 phone-portrait:py-2 phone-portrait:pb-2">
        <button
          type="button"
          onClick={onCreate}
          aria-current={creating ? "page" : undefined}
          className={cn(
            "flex w-11 shrink-0 flex-col items-center justify-center rounded-xl border text-brand transition",
            "phone-portrait:w-10",
            creating
              ? "border-brand bg-brand-light"
              : "border-dashed border-gray-300 bg-surface hover:border-brand/50 hover:bg-brand-light/60",
          )}
          aria-label="Nuevo pedido"
          title="Nuevo pedido"
        >
          <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
        </button>

        <ul className="flex min-w-0 flex-1 items-stretch gap-2" aria-label="Cola de pedidos">
          {orders.map((order) => (
            <li key={order.id} className="flex">
              <QueueChip
                order={order}
                active={order.id === activeOrderId}
                attention={attention.has(order.id) && order.id !== activeOrderId}
                waiting={orderWaitingForCustomer(order)}
                hasLocation={orderHasLocation(order)}
                onSelect={() => onSelect(order.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type ChipProps = {
  order: TOrder
  active: boolean
  attention: boolean
  waiting: boolean
  hasLocation: boolean
  onSelect: () => void
}

const QueueChip = ({ order, active, attention, waiting, hasLocation, onSelect }: ChipProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const publicToken = order.public_token
  const { restaurant } = useRestaurant()
  const prep = usePrepProgress(
    order.status === "preparing",
    order.ready_countdown,
    restaurant?.prep_time,
  )

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })
  }, [active])

  const name = order.customer_name?.trim()
  const statusLabel =
    prep.remaining != null
      ? `Preparando: ${formatPrepClock(prep.remaining)}`
      : orderStatusConfig[order.status].label

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-[13.5rem] shrink-0 overflow-hidden rounded-xl border transition",
        "phone-portrait:w-auto",
        active
          ? "border-brand bg-brand-light"
          : "border-gray-200 bg-surface hover:border-brand/40",
        attention && "rail-attention-glow",
        waiting && !attention && !active && "rail-wait-glow",
      )}
    >
      {prep.remaining != null ? (
        <PrepTimeFill percent={prep.percent} />
      ) : null}
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        aria-label={`Pedido ${order.id}${name ? `, ${name}` : ""}, ${statusLabel}`}
        className="relative z-10 flex min-w-0 flex-1 flex-col justify-between px-2.5 py-1.5 text-left phone-portrait:items-center phone-portrait:justify-center phone-portrait:px-2.5 phone-portrait:py-1.5"
      >
        <span className="flex items-start justify-between gap-1 phone-portrait:items-center">
          <span className="text-sm font-bold tabular-nums text-ink">#{order.id}</span>
          <span
            className={cn(
              "mt-0.5 max-w-[8rem] truncate text-[10px] font-semibold text-ink-muted phone-portrait:hidden",
              order.status !== "preparing" && "uppercase tracking-wide",
              order.status === "ready" && "text-brand",
              order.status === "returned" && "text-sky-800",
            )}
            style={
              order.status === "preparing"
                ? { color: prepStoplightText(prep.percent) }
                : undefined
            }
          >
            {statusLabel}
          </span>
        </span>
        <span className="mt-0.5 flex items-end justify-between gap-1 phone-portrait:hidden">
          <span className="min-w-0 truncate text-xs text-ink">
            {name || (waiting ? "Esperando cliente" : "Sin nombre")}
          </span>
          <FontAwesomeIcon
            icon={faLocationDot}
            className={cn("size-3 shrink-0", hasLocation ? "text-brand" : "text-ink-muted/50")}
            title={hasLocation ? "Ubicación lista" : "Sin ubicación"}
            aria-hidden
          />
        </span>
      </button>
      {publicToken ? (
        <div className="phone-portrait:hidden">
          <OrderQueueLinkMenu orderId={order.id} publicToken={publicToken} />
        </div>
      ) : null}
    </div>
  )
}

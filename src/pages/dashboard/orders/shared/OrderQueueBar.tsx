import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faLink, faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { useRestaurant } from "../../../../context/RestaurantContext"
import { usePrepProgress } from "../../../../hooks/usePrepProgress"
import type { TOrder } from "../../../../types/Order"
import { cn, formatPrepClock } from "../../../../utils/format"
import { prepStoplightText } from "../../../../utils/prepStoplight"
import { copyPublicOrderUrl } from "../../../../utils/orderShare"
import { orderStatusConfig } from "../../../../utils/status"
import { orderHasLocation, orderWaitingForCustomer } from "./orderQueue"
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
        "fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-surface-elevated/95 backdrop-blur-sm",
        "min-[1400px]:left-64",
      )}
    >
      <div className="flex items-stretch gap-2 overflow-x-auto px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onCreate}
          aria-current={creating ? "page" : undefined}
          className={cn(
            "flex w-11 shrink-0 flex-col items-center justify-center rounded-xl border text-brand transition",
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
  const [copied, setCopied] = useState(false)
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

  const handleCopy = async () => {
    if (!publicToken) return
    try {
      await copyPublicOrderUrl(publicToken)
      setCopied(true)
      toast.success(`Pedido #${order.id}: enlace copiado`)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("No se pudo copiar el enlace.")
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-[13.5rem] shrink-0 overflow-hidden rounded-xl border transition",
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
        className="relative z-10 flex min-w-0 flex-1 flex-col justify-between px-2.5 py-1.5 text-left"
      >
        <span className="flex items-start justify-between gap-1">
          <span className="text-sm font-bold tabular-nums text-ink">#{order.id}</span>
          <span
            className={cn(
              "mt-0.5 max-w-[8rem] truncate text-[10px] font-semibold text-ink-muted",
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
        <span className="mt-0.5 flex items-end justify-between gap-1">
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
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="relative z-10 flex w-8 shrink-0 items-center justify-center border-l border-gray-200/80 text-ink-muted transition hover:bg-brand-light hover:text-brand"
          aria-label={copied ? "Enlace copiado" : `Copiar enlace del pedido #${order.id}`}
          title={copied ? "Enlace copiado" : "Copiar enlace"}
        >
          <FontAwesomeIcon icon={copied ? faCheck : faLink} className="size-3" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}

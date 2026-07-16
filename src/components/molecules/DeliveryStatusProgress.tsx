import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import type { TDelivery } from "../../types/Delivery"
import {
  deliveryProgressSteps,
  deliveryStatusConfig,
  getDeliveryProgressIndex,
  getDeliveryStepTimestamp,
  isTerminalDeliveryFailure,
} from "../../utils/status"
import { cn, formatDateTime, formatTime } from "../../utils/format"

type DeliveryStatusProgressProps = {
  delivery: TDelivery
}

const stepTimeLabel = (value: string | null, reached: boolean) => {
  if (!value || !reached) return null
  const date = new Date(value)
  const sameDay = date.toDateString() === new Date().toDateString()
  return sameDay ? formatTime(value) : formatDateTime(value)
}

export const DeliveryStatusProgress = ({ delivery }: DeliveryStatusProgressProps) => {
  const { status } = delivery
  const currentIndex = getDeliveryProgressIndex(status)
  const failed = isTerminalDeliveryFailure(status)
  const completed = status === "delivered"
  const cancelled = status === "cancelled"
  const fillRatio =
    cancelled || currentIndex < 0
      ? 0
      : currentIndex / (deliveryProgressSteps.length - 1)
  const failureAt = getDeliveryStepTimestamp(delivery, status)

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Progreso</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {failed
              ? deliveryStatusConfig[status].label
              : `Estado actual: ${deliveryStatusConfig[status].label}`}
          </p>
        </div>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            failed ? "text-accent-clay" : completed ? "text-brand" : "text-ink-muted",
          )}
        >
          {failed ? "—" : `${Math.round(fillRatio * 100)}%`}
        </span>
      </div>

      <div className="relative px-1 pt-1">
        <div className="absolute top-5 right-8 left-8 h-1 rounded-full bg-gray-200" aria-hidden />
        {!cancelled && (
          <div
            className={cn(
              "absolute top-5 left-8 h-1 rounded-full transition-all duration-500 ease-out",
              failed ? "bg-accent-clay" : "bg-brand",
            )}
            style={{
              width: `calc(${fillRatio} * (100% - 4rem))`,
            }}
            aria-hidden
          />
        )}

        <ol className="relative flex justify-between">
          {deliveryProgressSteps.map((step, index) => {
            const reached = !cancelled && currentIndex >= index
            const isCurrent = !failed && status === step
            const isFailedAtStep = status === "absent_customer" && step === "in_transit"
            const timestamp = getDeliveryStepTimestamp(delivery, step)
            const timeLabel = stepTimeLabel(timestamp, reached || isFailedAtStep)

            return (
              <li key={step} className="flex w-16 flex-col items-center text-center sm:w-24">
                <span
                  className={cn(
                    "relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-300",
                    isFailedAtStep &&
                      "border-accent-clay bg-accent-clay text-white",
                    !isFailedAtStep &&
                      reached &&
                      "border-brand bg-brand text-white",
                    !isFailedAtStep &&
                      !reached &&
                      "border-gray-300 bg-surface-elevated text-gray-400",
                    isCurrent && "ring-4 ring-brand-muted",
                    cancelled && "border-gray-300 bg-gray-100 text-gray-400 opacity-60",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isFailedAtStep ? (
                    <FontAwesomeIcon icon={faXmark} className="size-3.5" aria-hidden />
                  ) : reached ? (
                    <FontAwesomeIcon icon={faCheck} className="size-3" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "mt-2 text-[11px] leading-tight font-medium sm:text-xs",
                    isFailedAtStep && "text-accent-clay",
                    !isFailedAtStep && reached && "text-brand",
                    !isFailedAtStep && !reached && "text-gray-400",
                  )}
                >
                  {deliveryStatusConfig[step].label}
                </span>
                <span
                  className={cn(
                    "mt-1 min-h-[1rem] text-[10px] tabular-nums sm:text-[11px]",
                    timeLabel ? "text-ink-muted" : "text-transparent",
                  )}
                >
                  {timeLabel ?? "—"}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {failed && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Esta entrega terminó como <strong>{deliveryStatusConfig[status].label}</strong>
          {failureAt ? <> el {formatDateTime(failureAt)}</> : null}.
        </p>
      )}
    </div>
  )
}

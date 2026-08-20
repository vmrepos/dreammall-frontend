import { useReadyCountdown } from "../../../../hooks/useReadyCountdown"
import { cn, formatPrepClock } from "../../../../utils/format"
import { prepStoplightText } from "../../../../utils/prepStoplight"

type Props = {
  seconds: number | null | undefined
  percentRemaining?: number
  className?: string
  expired?: boolean
}

export const ReadyCountdown = ({ seconds, percentRemaining, className, expired = false }: Props) => {
  const remaining = useReadyCountdown(seconds)
  const shown = remaining ?? (expired ? 0 : null)

  if (shown == null) return null

  return (
    <span
      className={cn("font-medium tabular-nums", className)}
      style={percentRemaining != null ? { color: prepStoplightText(percentRemaining) } : undefined}
    >
      Preparando: {formatPrepClock(shown)}
    </span>
  )
}

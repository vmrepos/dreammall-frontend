import { useReadyCountdown } from "../../../../hooks/useReadyCountdown"
import { cn, formatCountdown } from "../../../../utils/format"

type Props = {
  seconds: number | null | undefined
  className?: string
}

export const ReadyCountdown = ({ seconds, className }: Props) => {
  const remaining = useReadyCountdown(seconds)

  if (remaining == null) return null

  const urgent = remaining <= 60

  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        urgent ? "text-amber-600" : "text-brand",
        className,
      )}
    >
      Listo en {formatCountdown(remaining)}
    </span>
  )
}

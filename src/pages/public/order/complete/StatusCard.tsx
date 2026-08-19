import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
  icon: IconDefinition
  title: string
  description: string
}

export const StatusCard = ({ icon, title, description }: Props) => (
  <div className="rounded-[20px] border border-gray-200/80 bg-surface-elevated p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(12,107,61,0.06)]">
    <FontAwesomeIcon icon={icon} className="size-12 text-brand" aria-hidden />
    <h1 className="mt-4 text-[1.75rem] font-bold leading-tight text-brand">{title}</h1>
    <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{description}</p>
  </div>
)

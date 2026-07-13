import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { ReactNode } from "react"

type PageHeaderProps = {
  icon: IconDefinition
  section: string
  title: string
  description: string
  action?: ReactNode
}

export const PageHeader = ({ icon, section, title, description, action }: PageHeaderProps) => (
  <header className="mb-6 flex items-start justify-between gap-4">
    <div>
      <div className="mb-2 flex items-center gap-2 text-brand">
        <FontAwesomeIcon icon={icon} className="size-5" aria-hidden />
        <span className="text-sm font-semibold uppercase tracking-wide">{section}</span>
      </div>
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-1 text-[15px] text-ink-muted">{description}</p>
    </div>
    {action}
  </header>
)

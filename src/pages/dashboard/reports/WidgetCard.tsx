import type { ReactNode } from "react"
import { Card, CardHeader } from "../../../components/atoms/Card"
import { cn } from "../../../utils/format"

type WidgetCardProps = {
  title: string
  description?: string
  className?: string
  children?: ReactNode
}

/** Shell for report widgets — swap `children` for a real widget later. */
export const WidgetCard = ({ title, description, className, children }: WidgetCardProps) => (
  <Card className={cn("flex h-full flex-col", className)}>
    <CardHeader title={title} description={description} />
    <div className="flex min-h-40 flex-1 flex-col px-6 py-5">
      {children ?? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-surface/60 px-4 py-8 text-center">
          <p className="text-sm text-ink-muted">Widget pendiente</p>
        </div>
      )}
    </div>
  </Card>
)

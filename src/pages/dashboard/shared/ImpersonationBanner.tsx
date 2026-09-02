import { Button } from "../../../components/atoms/Button"

type Props = {
  restaurantName: string
  onStop: () => void
}

export const ImpersonationBanner = ({ restaurantName, onStop }: Props) => (
  <div className="flex items-center justify-between gap-3 border-b border-accent-sun/40 bg-accent-sun/15 px-6 py-2.5 phone:px-4">
    <p className="min-w-0 truncate text-sm font-medium text-ink">
      Viendo como <span className="font-semibold">{restaurantName}</span>
    </p>
    <Button variant="secondary" className="shrink-0 !px-3 !py-1.5 text-xs" onClick={onStop}>
      Volver a mi cuenta
    </Button>
  </div>
)

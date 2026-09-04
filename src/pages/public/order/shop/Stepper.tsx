import { cn } from "../../../../utils/format"

export type TShopStep = 1 | 2 | 3

type Props = {
  step: TShopStep
  canPreview: boolean
  onStep: (step: TShopStep) => void
}

const items: Array<{ step: TShopStep; label: string }> = [
  { step: 1, label: "Menú" },
  { step: 2, label: "Pedido" },
  { step: 3, label: "Datos" },
]

export const Stepper = ({ step, onStep, canPreview }: Props) => (
  <ol className="mt-4 flex items-center gap-2 text-sm font-semibold">
    {items.map((item, index) => (
      <li key={item.step} className="flex items-center gap-2">
        {index > 0 ? (
          <span className="text-gray-300" aria-hidden>
            →
          </span>
        ) : null}
        <button
          type="button"
          disabled={item.step !== 1 && !canPreview}
          onClick={() => onStep(item.step)}
          className={cn(
            "rounded-full px-3 py-1.5 transition disabled:cursor-not-allowed disabled:opacity-50",
            step === item.step ? "bg-brand text-white" : "bg-gray-100 text-ink hover:bg-gray-200",
          )}
        >
          {item.step}. {item.label}
        </button>
      </li>
    ))}
  </ol>
)

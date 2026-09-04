import { cn } from "../../../utils/format"

export type TPosStep = 1 | 2 | 3

type Props = {
  step: TPosStep
  onStep: (step: TPosStep) => void
}

const items: Array<{ step: TPosStep; label: string }> = [
  { step: 1, label: "Cliente" },
  { step: 2, label: "Pedido" },
  { step: 3, label: "Resumen" },
]

export const Stepper = ({ step, onStep }: Props) => (
  <ol className="flex min-w-0 items-center gap-1.5 text-sm font-semibold phone:gap-1">
    {items.map((item, index) => (
      <li key={item.step} className="flex min-w-0 items-center gap-1.5">
        {index > 0 ? (
          <span className="text-gray-300 phone:hidden" aria-hidden>
            →
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onStep(item.step)}
          className={cn(
            "rounded-full px-3 py-1.5 transition",
            "phone:px-2.5 phone:py-1 phone:text-xs",
            step === item.step ? "bg-brand text-white" : "bg-gray-100 text-ink hover:bg-gray-200",
          )}
        >
          {item.step}. {item.label}
        </button>
      </li>
    ))}
  </ol>
)

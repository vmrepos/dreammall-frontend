import { prepStoplightFill } from "../../../../utils/prepStoplight"

type Props = {
  percent: number
}

export const PrepTimeFill = ({ percent }: Props) => (
  <div
    className="pointer-events-none absolute inset-y-0 left-0 transition-[width,background-color] duration-1000 ease-linear"
    style={{ width: `${percent}%`, backgroundColor: prepStoplightFill(percent) }}
    aria-hidden
  />
)

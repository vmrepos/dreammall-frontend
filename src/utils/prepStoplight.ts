const GREEN = [12, 107, 61] as const
const YELLOW = [212, 160, 23] as const
const RED = [192, 57, 43] as const

const mix = (
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  t: number,
) => {
  const u = Math.min(1, Math.max(0, t))
  return [
    Math.round(from[0] + (to[0] - from[0]) * u),
    Math.round(from[1] + (to[1] - from[1]) * u),
    Math.round(from[2] + (to[2] - from[2]) * u),
  ] as const
}

export const prepStoplightRgb = (percentRemaining: number) => {
  const t = Math.min(100, Math.max(0, percentRemaining)) / 100
  if (t >= 0.5) return mix(YELLOW, GREEN, (t - 0.5) / 0.5)
  return mix(RED, YELLOW, t / 0.5)
}

export const prepStoplightFill = (percentRemaining: number) => {
  const [r, g, b] = prepStoplightRgb(percentRemaining)
  return `rgba(${r}, ${g}, ${b}, 0.38)`
}

export const prepStoplightText = (percentRemaining: number) => {
  const [r, g, b] = prepStoplightRgb(percentRemaining)
  return `rgb(${r}, ${g}, ${b})`
}

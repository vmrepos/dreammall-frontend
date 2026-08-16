import type { CSSProperties } from "react"

const GOLDEN_ANGLE = 137.508

export const categoryHueAt = (index: number) => (index * GOLDEN_ANGLE) % 360

export const categoryColorVars = (index: number, isDark: boolean): CSSProperties => {
  const h = categoryHueAt(index)
  const s = 50
  const solidL = isDark ? 54 : 40
  const fillL = isDark ? 48 : 50
  const fillA = isDark ? 0.22 : 0.14

  return {
    "--cat-solid": `hsl(${h} ${s}% ${solidL}%)`,
    "--cat-fill": `hsl(${h} ${s}% ${fillL}% / ${fillA})`,
    "--cat-border": `hsl(${h} ${s}% ${solidL}% / 0.5)`,
  } as CSSProperties
}

type TGroupLimits = {
  required: boolean
  multiple: boolean
  min_select?: number | null
  max_select?: number | null
}

/** Minimum selections for a group. Single-choice required → 1, optional → 0. */
export const groupMinSelect = (group: TGroupLimits) => {
  if (!group.multiple) return group.required ? 1 : 0
  if (group.min_select != null) return Math.max(0, group.min_select)
  return group.required ? 1 : 0
}

/** Maximum selections. `null` = unlimited (only when multiple). */
export const groupMaxSelect = (group: TGroupLimits): number | null => {
  if (!group.multiple) return 1
  if (group.max_select == null || group.max_select <= 0) return null
  return group.max_select
}

export const groupSelectionHint = (group: TGroupLimits) => {
  const min = groupMinSelect(group)
  const max = groupMaxSelect(group)

  if (!group.multiple) {
    return group.required ? "Elige 1" : "Opcional"
  }

  if (max == null && min <= 0) return "Elige varias"
  if (max == null) return min === 1 ? "Elige al menos 1" : `Elige al menos ${min}`
  if (min <= 0) return max === 1 ? "Elige hasta 1" : `Elige hasta ${max}`
  if (min === max) return `Elige ${min}`
  return `Elige de ${min} a ${max}`
}

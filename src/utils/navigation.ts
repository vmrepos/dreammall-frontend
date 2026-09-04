/** Relative app paths only — blocks open redirects via `next`. */
export const safeInternalPath = (value: string | null | undefined): string | null => {
  if (!value) return null
  if (!value.startsWith("/")) return null
  if (value.startsWith("//")) return null
  if (value.includes("://")) return null
  return value
}

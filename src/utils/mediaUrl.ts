/** Prefer absolute R2/CDN URLs as returned by ActiveStorage; only prefix relative paths. */
export const resolveMediaUrl = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) {
    return url
  }
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")
  return `${base}${url.startsWith("/") ? url : `/${url}`}`
}

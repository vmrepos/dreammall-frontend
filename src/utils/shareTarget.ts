export const SHARE_TARGET_PATH = "/pos/import-location"
export const SHARE_TARGET_STORAGE_KEY = "pedi2-share-target"

export type TShareTargetPayload = {
  title: string
  text: string
  url: string
  search: string
  params: Record<string, string>
  href: string
  referrer: string
  userAgent: string
  receivedAt: string
}

const readParams = (search: string): Record<string, string> => {
  const params: Record<string, string> = {}
  new URLSearchParams(search).forEach((value, key) => {
    params[key] = value
  })
  return params
}

export const payloadFromLocation = (location: {
  pathname: string
  search: string
  href: string
}): TShareTargetPayload | null => {
  if (location.pathname !== SHARE_TARGET_PATH) return null
  const params = readParams(location.search)
  const searchParams = new URLSearchParams(location.search)
  return {
    title: searchParams.get("title") ?? "",
    text: searchParams.get("text") ?? "",
    url: searchParams.get("url") ?? "",
    search: location.search,
    params,
    href: location.href,
    referrer: typeof document === "undefined" ? "" : document.referrer,
    userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent,
    receivedAt: new Date().toISOString(),
  }
}

export const shareTargetHasContent = (payload: TShareTargetPayload | null): payload is TShareTargetPayload => {
  if (!payload) return false
  return (
    payload.title !== "" ||
    payload.text !== "" ||
    payload.url !== "" ||
    Object.keys(payload.params).length > 0
  )
}

export const shareTargetBlob = (payload: TShareTargetPayload): string =>
  [payload.title, payload.text, payload.url, payload.search, ...Object.values(payload.params)]
    .filter(Boolean)
    .join("\n")

export const readStoredShareTarget = (): TShareTargetPayload | null => {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(SHARE_TARGET_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as TShareTargetPayload
  } catch {
    return null
  }
}

export const captureShareTargetFromWindow = () => {
  if (typeof window === "undefined") return
  const payload = payloadFromLocation({
    pathname: window.location.pathname,
    search: window.location.search,
    href: window.location.href,
  })
  if (!payload) return
  if (!shareTargetHasContent(payload) && shareTargetHasContent(readStoredShareTarget())) return
  sessionStorage.setItem(SHARE_TARGET_STORAGE_KEY, JSON.stringify(payload))
}

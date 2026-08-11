export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))

export const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("es", { style: "currency", currency: "BOB" }).format(Number(value))

export const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes > 0) return `${minutes}:${String(secs).padStart(2, "0")}`
  return `${secs} s`
}

export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const tableRowLinkClass = cn(
  "transition hover:bg-gray-50/60",
  "cursor-pointer",
)

export const formatCoords = (latitude?: number | null, longitude?: number | null) => {
  if (latitude == null || longitude == null || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return ""
  }
  return `${latitude}, ${longitude}`
}

export const parseCoords = (value: string) => {
  const [rawLat = "", rawLng = ""] = value.split(",")
  const latitude = Number.parseFloat(rawLat.trim())
  const longitude = Number.parseFloat(rawLng.trim())

  return {
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  }
}
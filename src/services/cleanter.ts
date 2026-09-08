export type TCleanterTextBlock = {
  type: "text"
  text: string
  align?: "left" | "center" | "right"
  bold?: boolean
  size?: "small" | "normal" | "large"
}

export type TCleanterRowBlock = {
  type: "row"
  left: string
  right: string
  bold?: boolean
}

export type TCleanterDividerBlock = {
  type: "divider"
  char?: string
}

export type TCleanterFeedBlock = {
  type: "feed"
  lines?: number
}

export type TCleanterBlock =
  | TCleanterTextBlock
  | TCleanterRowBlock
  | TCleanterDividerBlock
  | TCleanterFeedBlock

export type TCleanterJob = {
  content: TCleanterBlock[]
  paperWidth?: 58 | 80
  cut?: boolean
  reference?: string
}

const configuredUrl = import.meta.env.VITE_CLEANTER_URL?.trim()
export const CLEANTER_URL = (configuredUrl || "http://localhost:9100").replace(/\/$/, "")

const PRINT_TIMEOUT_MS = 15_000

type TCleanterErrorBody = {
  error?: string
  detail?: string
  fix?: string
}

const PRINT_ERROR_BY_CODE: Record<string, string> = {
  bluetooth_permission_missing: "Cleanter necesita permiso de Bluetooth.",
  bluetooth_disabled: "Activa el Bluetooth para imprimir.",
  printer_not_connected: "Selecciona la impresora en Cleanter.",
  printer_not_paired: "Vuelve a emparejar la impresora en Android.",
  printer_unreachable: "Revisa que la impresora esté encendida, cerca y con papel.",
}

export class CleanterPrintError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = "CleanterPrintError"
    this.code = code
  }
}

export const printCleanterJob = async (job: TCleanterJob) => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), PRINT_TIMEOUT_MS)

  try {
    const response = await fetch(`${CLEANTER_URL}/print`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
      signal: controller.signal,
    })

    if (response.ok) return

    const body = (await response.json().catch(() => ({}))) as TCleanterErrorBody
    const code = typeof body.error === "string" ? body.error : undefined
    throw new CleanterPrintError(
      PRINT_ERROR_BY_CODE[code ?? ""] ?? "No se pudo imprimir el ticket.",
      code,
    )
  } catch (error) {
    if (error instanceof CleanterPrintError) throw error
    throw new CleanterPrintError(
      `Cleanter no responde en ${CLEANTER_URL}. Ábrelo en el teléfono.`,
    )
  } finally {
    window.clearTimeout(timer)
  }
}

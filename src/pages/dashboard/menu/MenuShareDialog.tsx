import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy, faDownload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { toBlob, toPng } from "html-to-image"
import { toast } from "sonner"
import { Button } from "../../../components/atoms/Button"
import type { TProduct } from "../../../types/Product"
import { formatCurrency } from "../../../utils/format"
import logoPedi2 from "../../../assets/logo-pedi2-horizontal-light.png"

const FLYER_BG = "#fffaf2"
const FLYER_INK = "#1c241f"
const FLYER_MUTED = "#6b6258"
const FLYER_LINE = "#d8cfc0"
const FLYER_ACCENT = "#0c6b3d"
const FLYER_WIDTH = 720

type Props = {
  open: boolean
  menuName: string
  restaurantName: string
  address?: string | null
  whatsapp?: string | null
  products: TProduct[]
  onClose: () => void
}

const productsForFlyer = (products: TProduct[]) => {
  const active = products.filter((product) => product.active)
  const source = active.length > 0 ? active : products
  return [...source].sort(
    (a, b) => a.position - b.position || a.name.localeCompare(b.name, "es"),
  )
}

const fileSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "menu"

export const MenuShareDialog = ({
  open,
  menuName,
  restaurantName,
  address,
  whatsapp,
  products,
  onClose,
}: Props) => {
  const flyerRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const items = productsForFlyer(products)

  if (!open) return null

  const captureOptions = {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: FLYER_BG,
  }

  const withFlyer = async () => {
    const node = flyerRef.current
    if (!node) throw new Error("flyer missing")
    await document.fonts.ready
    await Promise.all(
      [...node.querySelectorAll("img")].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true })
              img.addEventListener("error", () => resolve(), { once: true })
            }),
      ),
    )
    return node
  }

  const downloadImage = async () => {
    setExporting(true)
    try {
      const node = await withFlyer()
      const dataUrl = await toPng(node, captureOptions)
      const link = document.createElement("a")
      link.download = `${fileSlug(menuName)}.png`
      link.href = dataUrl
      link.click()
      toast.success("Imagen descargada")
    } catch {
      toast.error("No se pudo generar la imagen. Puedes capturar la pantalla.")
    } finally {
      setExporting(false)
    }
  }

  const copyImage = async () => {
    setExporting(true)
    try {
      const node = await withFlyer()
      const blob = await toBlob(node, captureOptions)
      if (!blob) throw new Error("empty blob")
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      toast.success("Imagen copiada")
    } catch {
      toast.error("No se pudo copiar. Descarga la imagen o captura la pantalla.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[20px] bg-surface-elevated shadow-[0_16px_48px_rgba(0,0,0,0.18)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Imagen del menú</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Captura la pantalla o descarga el PNG para compartirlo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-gray-100 hover:text-ink"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faXmark} className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[#ece6db] px-4 py-5">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-muted">
              Este menú no tiene productos para mostrar.
            </p>
          ) : (
            <div className="mx-auto w-fit max-w-full shadow-[0_12px_40px_rgba(28,36,31,0.18)]">
              <div
                ref={flyerRef}
                style={{
                  position: "relative",
                  width: FLYER_WIDTH,
                  boxSizing: "border-box",
                  background: FLYER_BG,
                  color: FLYER_INK,
                  fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
                  padding: "48px 44px 40px",
                }}
              >
                <img
                  src={logoPedi2}
                  alt="Pedi2"
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 18,
                    height: 22,
                    width: "auto",
                    opacity: 0.78,
                    objectFit: "contain",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    color: FLYER_ACCENT,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {restaurantName}
                </p>
                <h3
                  style={{
                    margin: "10px 0 0",
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    textAlign: "center",
                    lineHeight: 1.15,
                  }}
                >
                  {menuName}
                </h3>
                <div
                  style={{
                    width: 64,
                    height: 3,
                    margin: "18px auto 32px",
                    background: FLYER_ACCENT,
                    borderRadius: 99,
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {items.map((product) => (
                    <div key={product.id}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                          {product.name}
                        </span>
                        <span
                          style={{
                            flex: 1,
                            borderBottom: `1px dotted ${FLYER_LINE}`,
                            minWidth: 16,
                            transform: "translateY(-4px)",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            color: FLYER_ACCENT,
                          }}
                        >
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      {product.description?.trim() ? (
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: 14,
                            lineHeight: 1.45,
                            color: FLYER_MUTED,
                          }}
                        >
                          {product.description.trim()}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {(address || whatsapp) && (
                  <div
                    style={{
                      marginTop: 36,
                      paddingTop: 18,
                      borderTop: `1px solid ${FLYER_LINE}`,
                      textAlign: "center",
                      fontSize: 13,
                      color: FLYER_MUTED,
                      lineHeight: 1.5,
                    }}
                  >
                    {address ? <p style={{ margin: 0 }}>{address}</p> : null}
                    {whatsapp ? (
                      <p style={{ margin: address ? "4px 0 0" : 0 }}>WhatsApp {whatsapp}</p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <Button variant="secondary" onClick={onClose} disabled={exporting}>
            Cerrar
          </Button>
          <Button
            variant="secondary"
            onClick={() => void copyImage()}
            disabled={exporting || items.length === 0}
          >
            <FontAwesomeIcon icon={faCopy} className="size-4" aria-hidden />
            Copiar imagen
          </Button>
          <Button onClick={() => void downloadImage()} disabled={exporting || items.length === 0}>
            <FontAwesomeIcon icon={faDownload} className="size-4" aria-hidden />
            {exporting ? "Generando..." : "Descargar PNG"}
          </Button>
        </div>
      </div>
    </div>
  )
}

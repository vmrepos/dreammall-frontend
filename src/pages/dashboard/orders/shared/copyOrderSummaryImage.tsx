import { createRoot } from "react-dom/client"
import { flushSync } from "react-dom"
import { toBlob } from "html-to-image"
import type { TOrder } from "../../../../types/Order"
import { OrderSummaryCard } from "./OrderSummaryCard"

export type TSummaryImageResult = "copied" | "shared"

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError"

const copyBlob = async (blob: Blob) => {
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
  } catch {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": Promise.resolve(blob) }),
    ])
  }
}

export const copyOrderSummaryImage = async (order: TOrder): Promise<TSummaryImageResult> => {
  const host = document.createElement("div")
  host.setAttribute("aria-hidden", "true")
  host.style.cssText = "position:fixed;left:-10000px;top:0;width:360px;"
  document.body.appendChild(host)

  const root = createRoot(host)

  try {
    flushSync(() => {
      root.render(<OrderSummaryCard order={order} />)
    })

    const node = host.firstElementChild
    if (!(node instanceof HTMLElement)) throw new Error("missing card")

    const blob = await toBlob(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor:
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-surface-elevated")
          .trim() || "#ffffff",
    })
    if (!blob) throw new Error("empty image")

    const file = new File([blob], `pedido-${order.id}-resumen.png`, { type: "image/png" })
    if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Pedido #${order.id}`,
        })
        return "shared"
      } catch (error) {
        if (isAbort(error)) throw error
      }
    }

    await copyBlob(blob)
    return "copied"
  } finally {
    root.unmount()
    host.remove()
  }
}

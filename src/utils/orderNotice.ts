export const showBackgroundOrderNotice = (title: string, body: string, url = "/r/orders") => {
  if (typeof window === "undefined") return
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return
  if (!document.hidden && document.hasFocus()) return

  try {
    const notice = new Notification(title, {
      body,
      icon: "/pwa-192.png",
      tag: "pedi2-order",
      silent: false,
    })
    notice.onclick = () => {
      window.focus()
      if (window.location.pathname !== url) window.location.assign(url)
      notice.close()
    }
  } catch {
    // Notification from a hidden document is best-effort; Web Push covers killed PWAs.
  }
}

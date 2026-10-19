/* Pedí2 restaurant panel — every push must show a notification (Chrome drops the
   subscription if we skip; Windows also reports the PWA as focused behind Maps). */
self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = panelPath(event.notification.data?.url)
  event.waitUntil(openOrFocus(url))
})

function panelPath(url) {
  if (typeof url !== "string" || url === "") return "/r/orders"
  try {
    const parsed = new URL(url, self.location.origin)
    if (parsed.origin !== self.location.origin) return "/r/orders"
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`
    if (path !== "/r" && !path.startsWith("/r/")) return "/r/orders"
    return path
  } catch {
    return "/r/orders"
  }
}

async function handlePush(event) {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = { body: event.data ? event.data.text() : "" }
  }

  const title = payload.title || "Pedí2"
  const orderId = payload.order_id
  const type = payload.type || "order"
  await self.registration.showNotification(title, {
    body: payload.body || "Hay un pedido nuevo",
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
    tag: `pedi2-${type}-${orderId || "x"}`,
    renotify: true,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      url: panelPath(payload.url),
      type,
      order_id: orderId,
    },
  })
}

async function openOrFocus(url) {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
  for (const client of clients) {
    if (client.url.includes("/r") && "focus" in client) {
      await client.focus()
      if ("navigate" in client) await client.navigate(url)
      return
    }
  }
  await self.clients.openWindow(url)
}

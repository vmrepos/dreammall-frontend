/* Pedí2 restaurant panel — OS notifications when the panel is not in front. */
self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/r/orders"
  event.waitUntil(openOrFocus(url))
})

async function handlePush(event) {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
  // Windows PWAs often stay "focused" while another app is in front. Require visible.
  const looking = windows.some((client) => client.visibilityState === "visible" && client.focused)
  if (looking) return

  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = { body: event.data ? event.data.text() : "" }
  }

  const title = payload.title || "Pedí2"
  const orderId = payload.order_id
  await self.registration.showNotification(title, {
    body: payload.body || "Hay un pedido nuevo",
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
    tag: orderId ? `order-${orderId}` : "pedi2-order",
    renotify: true,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      url: payload.url || "/r/orders",
      type: payload.type,
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

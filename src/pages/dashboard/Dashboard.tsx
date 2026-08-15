import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { Sidebar } from "./Sidebar"
import { MenuProvider } from "../../context/providers/MenuProvider"
import { OrdersProvider } from "../../context/providers/OrdersProvider"
import { RestaurantProvider } from "../../context/providers/RestaurantProvider"
import { SubscriptionProvider } from "../../context/providers/SubscriptionProvider"

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!sidebarOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [sidebarOpen])

  return (
    <MenuProvider>
      <OrdersProvider>
        <RestaurantProvider>
          <SubscriptionProvider>
            <div className="flex min-h-svh bg-surface">
              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center border-b border-gray-200 bg-surface px-3 py-2 min-[1400px]:hidden">
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-xl text-ink transition hover:bg-gray-100"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir menú"
                  >
                    <FontAwesomeIcon icon={faBars} className="size-5" />
                  </button>
                </header>
                <main className="min-w-0 flex-1 bg-surface p-4 min-[1400px]:p-6">
                  <Outlet />
                </main>
              </div>
            </div>
          </SubscriptionProvider>
        </RestaurantProvider>
      </OrdersProvider>
    </MenuProvider>
  )
}

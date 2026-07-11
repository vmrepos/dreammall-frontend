import { Outlet } from "react-router-dom"
import { MenuCatalogProvider } from "../../context/MenuCatalogContext"
import { OrdersProvider } from "../../context/OrdersContext"
import { SubscriptionProvider } from "../../context/SubscriptionContext"
import { Sidebar } from "./Sidebar"

export const Dashboard = () => {
  return (
    <MenuCatalogProvider>
      <OrdersProvider>
        <SubscriptionProvider>
          <div className="flex min-h-svh">
            <Sidebar />
            <main className="min-w-0 flex-1 bg-gray-50 p-6">
              <Outlet />
            </main>
          </div>
        </SubscriptionProvider>
      </OrdersProvider>
    </MenuCatalogProvider>
  )
}

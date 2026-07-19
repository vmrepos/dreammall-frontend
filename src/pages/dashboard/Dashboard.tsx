import { Outlet } from "react-router-dom"
import { OrdersProvider } from "../../context/OrdersContext"
import { SubscriptionProvider } from "../../context/SubscriptionContext"
import { Sidebar } from "./Sidebar"
import { MenuProvider } from "../../context/MenuContext"

export const Dashboard = () => {
  return (
    <MenuProvider>
      <OrdersProvider>
        <SubscriptionProvider>
          <div className="flex min-h-svh bg-surface">
            <Sidebar />
            <main className="min-w-0 flex-1 bg-surface p-6">
              <Outlet />
            </main>
          </div>
        </SubscriptionProvider>
      </OrdersProvider>
    </MenuProvider>
  )
}

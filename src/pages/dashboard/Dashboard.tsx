import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

import { MenuProvider } from "../../context/providers/MenuProvider"
import { OrdersProvider } from "../../context/providers/OrdersProvider"
import { RestaurantProvider } from "../../context/providers/RestaurantProvider"
import { SubscriptionProvider } from "../../context/providers/SubscriptionProvider"

export const Dashboard = () => {
  return (
    <MenuProvider>
      <OrdersProvider>
        <RestaurantProvider>
          <SubscriptionProvider>
            <div className="flex min-h-svh bg-surface">
              <Sidebar />
              <main className="min-w-0 flex-1 bg-surface p-6">
                <Outlet />
              </main>
            </div>
          </SubscriptionProvider>
        </RestaurantProvider>
      </OrdersProvider>
    </MenuProvider>
  )
}

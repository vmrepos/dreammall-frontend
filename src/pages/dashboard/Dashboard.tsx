import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { BottomTabs } from "./BottomTabs"
import { DeliveriesProvider } from "../../context/providers/DeliveriesProvider"
import { MenuProvider } from "../../context/providers/MenuProvider"
import { OrdersProvider } from "../../context/providers/OrdersProvider"
import { RestaurantProvider } from "../../context/providers/RestaurantProvider"

export const Dashboard = () => (
  <DeliveriesProvider>
    <MenuProvider>
      <OrdersProvider>
        <RestaurantProvider>
          <div className="flex min-h-svh bg-surface [--bottom-tabs-h:0px] phone:[--bottom-tabs-h:calc(3.5rem+env(safe-area-inset-bottom,0px))]">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <main className="min-w-0 flex-1 bg-surface p-6 phone:px-4 phone:pt-4 phone:pb-[calc(1rem+var(--bottom-tabs-h))]">
                <Outlet />
              </main>
            </div>
            <BottomTabs />
          </div>
        </RestaurantProvider>
      </OrdersProvider>
    </MenuProvider>
  </DeliveriesProvider>
)

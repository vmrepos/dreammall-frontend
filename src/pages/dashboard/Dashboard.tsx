import { Outlet, useNavigate } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { BottomTabs } from "./BottomTabs"
import { DeliveriesProvider } from "../../context/providers/DeliveriesProvider"
import { MenuProvider } from "../../context/providers/MenuProvider"
import { OrdersProvider } from "../../context/providers/OrdersProvider"
import { RestaurantProvider } from "../../context/providers/RestaurantProvider"
import { useAuth } from "../../context/AuthContext"
import { ImpersonationBanner } from "./shared/ImpersonationBanner"
import { AdminPickRestaurant } from "./shared/AdminPickRestaurant"

export const Dashboard = () => {
  const { restaurant, isAdmin, impersonating, stopImpersonating } = useAuth()
  const navigate = useNavigate()

  const handleStopImpersonating = async () => {
    await stopImpersonating()
    navigate("/menu", { replace: true })
  }

  return (
    <div className="flex min-h-svh bg-surface [--bottom-tabs-h:0px] phone:[--bottom-tabs-h:calc(3.5rem+env(safe-area-inset-bottom,0px))]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {impersonating && restaurant && (
          <ImpersonationBanner
            restaurantName={restaurant.name}
            onStop={() => void handleStopImpersonating()}
          />
        )}
        <main className="min-w-0 flex-1 bg-surface p-6 phone:px-4 phone:pt-4 phone:pb-[calc(1rem+var(--bottom-tabs-h))]">
          {restaurant ? (
            <DeliveriesProvider key={restaurant.id}>
              <MenuProvider>
                <OrdersProvider>
                  <RestaurantProvider>
                    <Outlet />
                  </RestaurantProvider>
                </OrdersProvider>
              </MenuProvider>
            </DeliveriesProvider>
          ) : isAdmin ? (
            <AdminPickRestaurant />
          ) : null}
        </main>
      </div>
      <BottomTabs />
    </div>
  )
}

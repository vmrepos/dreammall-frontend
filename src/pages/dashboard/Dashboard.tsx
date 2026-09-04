import { useEffect, useState, type CSSProperties } from "react"
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

const SIDEBAR_KEY = "pedi2-sidebar-collapsed"
const SIDEBAR_EXPANDED = "16rem"
const SIDEBAR_COLLAPSED = "4.5rem"

const readCollapsed = () => {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === "1"
  } catch {
    return false
  }
}

export const Dashboard = () => {
  const { restaurant, isAdmin, impersonating, stopImpersonating } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(readCollapsed)

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0")
  }, [collapsed])

  const handleStopImpersonating = async () => {
    await stopImpersonating()
    navigate("/menu", { replace: true })
  }

  return (
    <div
      className="flex min-h-svh bg-surface [--bottom-tabs-h:0px] phone:[--bottom-tabs-h:calc(3.5rem+env(safe-area-inset-bottom,0px))]"
      style={
        {
          "--sidebar-w": collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        } as CSSProperties
      }
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
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

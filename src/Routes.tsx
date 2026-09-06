import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/providers/AuthProvider"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicRoute } from "./components/auth/PublicRoute"
import { PwaInstallBanner } from "./components/molecules/PwaInstallBanner"
import { WebPushBanner } from "./components/molecules/WebPushBanner"
import { CableProvider } from "./context/providers/CableProvider"
import { Auth } from "./pages/auth/Auth"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { Deliveries, DELIVERIES_SECTION_ENABLED } from "./pages/dashboard/deliveries/Deliveries"
import { Menu } from "./pages/dashboard/menu/Menu"
import { MenuLayout } from "./pages/dashboard/menu/MenuLayout"
import { Products } from "./pages/dashboard/menu/products/Products"
import { Orders } from "./pages/dashboard/orders/Orders"
import { Profile } from "./pages/dashboard/profile/Profile"
import { Reports } from "./pages/dashboard/reports/Reports"
import { Settings } from "./pages/dashboard/settings/Settings"
import { Pos } from "./pages/dashboard/pos/Pos"
import { Page as Landing } from "./pages/public/landing/Page"
import { Locales } from "./pages/public/locales/Locales"
import { PublicOrder } from "./pages/public/order/Order"
import { isLegacyRestaurantPath, restaurantPath } from "./utils/navigation"
import { usePwaUpdate } from "./hooks/usePwaUpdate"

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/locales" element={<Locales.Index />} />
      <Route path="/pedido/:token" element={<PublicOrder.Complete />} />
      <Route path="/pedir/:token" element={<PublicOrder.Shop />} />
      <Route path="/pedir" element={<Navigate to="/locales" replace />} />
      <Route path="/r" element={<RestaurantApp />}>
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Auth.Login />} />
          <Route path="register" element={<Auth.Register />} />
          <Route path="register/thanks" element={<Auth.RegisterThanks />} />
          <Route path="forgot-password" element={<Auth.ForgotPassword />} />
          <Route path="reset-password" element={<Auth.ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Dashboard />}>
            <Route index element={<Navigate to={restaurantPath("/orders")} replace />} />
            <Route path="pos" element={<Pos.Index />} />
            <Route path="pos/import-location" element={<Pos.ImportLocation />} />
            <Route path="orders" element={<Orders.Layout />}>
              <Route index element={<Orders.Index />} />
              <Route path="new" element={<Orders.Create />} />
              <Route path=":id" element={<Orders.Show />} />
            </Route>
            {DELIVERIES_SECTION_ENABLED ? (
              <>
                <Route path="deliveries" element={<Deliveries.Index />} />
                <Route path="deliveries/new" element={<Deliveries.Create />} />
                <Route path="deliveries/:id" element={<Deliveries.Show />} />
              </>
            ) : (
              <Route path="deliveries/*" element={<Navigate to={restaurantPath("/orders")} replace />} />
            )}
            <Route path="profile" element={<Profile.Index />} />
            <Route path="settings" element={<Settings.Index />} />
            <Route path="subscription" element={<Navigate to={restaurantPath("/orders")} replace />} />
            <Route path="reports" element={<Reports.Index />} />
            <Route path="menu" element={<MenuLayout />}>
              <Route index element={<Menu.Index />} />
              <Route path="new" element={<Menu.New />} />
              <Route path=":menuId/edit" element={<Menu.Edit />} />
              <Route path=":menuId/products/new" element={<Products.Form />} />
              <Route path=":menuId/products/:productId/edit" element={<Products.Form />} />
              <Route path=":menuId" element={<Menu.Show />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={restaurantPath("/orders")} replace />} />
      </Route>
      <Route path="*" element={<LegacyRestaurantRedirect />} />
    </Routes>
  </BrowserRouter>
)

const LegacyRestaurantRedirect = () => {
  const { pathname, search } = useLocation()
  if (isLegacyRestaurantPath(pathname)) {
    return <Navigate to={`${restaurantPath(pathname)}${search}`} replace />
  }
  return <Navigate to="/" replace />
}

const RestaurantApp = () => {
  usePwaUpdate()

  return (
    <AuthProvider>
      <CableProvider>
        <PwaInstallBanner />
        <WebPushBanner />
        <Outlet />
      </CableProvider>
    </AuthProvider>
  )
}

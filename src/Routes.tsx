import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/providers/AuthProvider"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicRoute } from "./components/auth/PublicRoute"
import { CableProvider } from "./context/providers/CableProvider"
import { Auth } from "./pages/auth/Auth"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { Deliveries } from "./pages/dashboard/deliveries/Deliveries"
import { Menu } from "./pages/dashboard/menu/Menu"
import { MenuLayout } from "./pages/dashboard/menu/MenuLayout"
import { Products } from "./pages/dashboard/menu/products/Products"
import { Orders } from "./pages/dashboard/orders/Orders"
import { Profile } from "./pages/dashboard/profile/Profile"
import { Reports } from "./pages/dashboard/reports/Reports"
import { Settings } from "./pages/dashboard/settings/Settings"
import { Subscription } from "./pages/dashboard/subscription/Subscription"

export const AppRoutes = () => {
  return (
    <AuthProvider>
      <CableProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Auth.Login />} />
              <Route path="/register" element={<Auth.Register />} />
              <Route path="/forgot-password" element={<Auth.ForgotPassword />} />
              <Route path="/reset-password" element={<Auth.ResetPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<Navigate to="/orders" replace />} />
                <Route path="orders" element={<Orders.Index />} />
                <Route path="orders/new" element={<Orders.Create />} />
                <Route path="orders/:id" element={<Orders.Show />} />
                <Route path="deliveries" element={<Deliveries.Index />} />
                <Route path="deliveries/new" element={<Deliveries.Create />} />
                <Route path="deliveries/:id" element={<Deliveries.Show />} />
                <Route path="profile" element={<Profile.Index />} />
                <Route path="settings" element={<Settings.Index />} />
                <Route path="subscription" element={<Subscription.Index />} />
                <Route path="reports" element={<Reports.Index />} />
                <Route path="menu" element={<MenuLayout />}>
                  <Route index element={<Menu.Index />} />
                  <Route path="new" element={<Menu.New />} />
                  <Route path=":menuId/products/new" element={<Products.Form />} />
                  <Route path=":menuId/products/:productId/edit" element={<Products.Form />} />
                  <Route path=":menuId" element={<Menu.Show />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CableProvider>
    </AuthProvider>
  )
}

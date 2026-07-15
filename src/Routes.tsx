import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicRoute } from "./components/auth/PublicRoute"
import { Dashboard } from "./pages/dashboard/Dashboard"

import { DeliveriesPage } from "./pages/dashboard/deliveries/DeliveriesPage"
import { DeliveryShowPage } from "./pages/dashboard/deliveries/DeliveryShowPage"
import { DeliveryCreatePage } from "./pages/dashboard/deliveries/DeliveryCreatePage"
import { ProfilePage } from "./pages/dashboard/profile/ProfilePage"
import { SettingsPage } from "./pages/dashboard/settings/SettingsPage"
import { SubscriptionPage } from "./pages/dashboard/subscription/SubscriptionPage"
import { MenusPage } from "./pages/dashboard/menu/Index"
import { MenuLayout } from "./pages/dashboard/menu/MenuLayout"
import { MenuShowPage } from "./pages/dashboard/menu/Show"
import { ProductFormPage } from "./pages/dashboard/menu/ProductFormPage"
import { Orders } from "./pages/dashboard/orders/Orders"

export const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to="/orders" replace />} />
              <Route path="orders" element={<Orders.Index />} />
              <Route path="orders/new" element={<Orders.Create />} />
              <Route path="orders/:id" element={<Orders.Show />} />
              <Route path="deliveries" element={<DeliveriesPage />} />
              <Route path="deliveries/new" element={<DeliveryCreatePage />} />
              <Route path="deliveries/:id" element={<DeliveryShowPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="menu" element={<MenuLayout />}>
                <Route index element={<MenusPage />} />
                <Route path=":menuId/products/new" element={<ProductFormPage />} />
                <Route path=":menuId/products/:productId/edit" element={<ProductFormPage />} />
                <Route path=":menuId" element={<MenuShowPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

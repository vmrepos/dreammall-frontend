import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicRoute } from "./components/auth/PublicRoute"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { OrdersPage } from "./pages/dashboard/orders/OrdersPage"
import { OrderCreatePage } from "./pages/dashboard/orders/OrderCreatePage"
import { OrderShowPage } from "./pages/dashboard/orders/OrderShowPage"
import { DeliveriesPage } from "./pages/dashboard/deliveries/DeliveriesPage"
import { DeliveryShowPage } from "./pages/dashboard/deliveries/DeliveryShowPage"
import { DeliveryCreatePage } from "./pages/dashboard/deliveries/DeliveryCreatePage"
import { ProfilePage } from "./pages/dashboard/profile/ProfilePage"
import { SettingsPage } from "./pages/dashboard/settings/SettingsPage"
import { SubscriptionPage } from "./pages/dashboard/subscription/SubscriptionPage"
import { MenusPage } from "./pages/dashboard/menu/MenusPage"
import { MenuLayout } from "./pages/dashboard/menu/MenuLayout"
import { MenuShowPage } from "./pages/dashboard/menu/MenuShowPage"
import { ProductFormPage } from "./pages/dashboard/menu/ProductFormPage"

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
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/new" element={<OrderCreatePage />} />
              <Route path="orders/:id" element={<OrderShowPage />} />
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

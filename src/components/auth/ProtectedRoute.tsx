import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const ProtectedRoute = () => {
  const { restaurant, isAdmin, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!restaurant && !isAdmin) return <Navigate to="/login" replace />

  return <Outlet />
}

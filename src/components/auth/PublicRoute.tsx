import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const PublicRoute = () => {
  const { restaurant, isAdmin, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (restaurant || isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}

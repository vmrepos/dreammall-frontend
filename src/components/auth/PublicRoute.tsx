import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const PublicRoute = () => {
  const { restaurant, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (restaurant) return <Navigate to="/" replace />

  return <Outlet />
}

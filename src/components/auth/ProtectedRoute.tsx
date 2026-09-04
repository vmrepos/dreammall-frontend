import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const ProtectedRoute = () => {
  const { restaurant, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div>Loading...</div>
  if (!restaurant && !isAdmin) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  return <Outlet />
}

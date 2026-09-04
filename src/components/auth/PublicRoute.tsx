import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { safeInternalPath } from "../../utils/navigation"

export const PublicRoute = () => {
  const { restaurant, isAdmin, isLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const next = safeInternalPath(searchParams.get("next"))

  if (isLoading) return <div>Loading...</div>
  if (restaurant || isAdmin) return <Navigate to={next ?? "/"} replace />

  return <Outlet />
}

import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export const Dashboard = () => {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}

import { Toaster } from "sonner"
import { AppRoutes } from "./Routes"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App

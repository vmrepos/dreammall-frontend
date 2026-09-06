import { Toaster } from "sonner"
import { AppRoutes } from "./Routes"
import { ThemeProvider } from "./context/providers/ThemeProvider"

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App

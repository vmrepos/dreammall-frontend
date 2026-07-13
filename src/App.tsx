import { AppRoutes } from "./Routes"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App

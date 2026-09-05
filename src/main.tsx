import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureShareTargetFromWindow } from './utils/shareTarget'

captureShareTargetFromWindow()

createRoot(document.getElementById('root')!).render(

  <App />

)

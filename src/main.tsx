import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { disableCustomerHostPwa } from './utils/pwa'
import { captureShareTargetFromWindow } from './utils/shareTarget'

disableCustomerHostPwa()
captureShareTargetFromWindow()

createRoot(document.getElementById('root')!).render(

  <App />

)

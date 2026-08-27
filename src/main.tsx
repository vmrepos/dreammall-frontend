import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { disableCustomerHostPwa } from './utils/pwa'

disableCustomerHostPwa()

createRoot(document.getElementById('root')!).render(

  <App />

)

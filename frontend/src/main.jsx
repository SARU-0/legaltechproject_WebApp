import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

// Point d'entrée principal de l'application React
// createRoot lie l'application au div 'root' présent dans index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Composant principal App qui contient toute la logique de navigation */}
    <App />
  </StrictMode>,
)


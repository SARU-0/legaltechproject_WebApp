import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration de Vite pour le projet Frontend React
// Pour plus de détails : https://vite.dev/config/
export default defineConfig({
  // Utilisation du plugin officiel React pour Vite (gestion du JSX, Fast Refresh, etc.)
  plugins: [react()],
})

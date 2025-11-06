import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Data_Viz_Lab/', // GitHub Pages project path
  plugins: [react()],
})
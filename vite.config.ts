import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ferryeasy-booking-ui/',
  plugins: [react()],
  server: {
    open: true,
  }
})

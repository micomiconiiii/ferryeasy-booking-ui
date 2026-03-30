import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ferryeasy-booking-ui/',
  server: {
    open: true,
  }
})

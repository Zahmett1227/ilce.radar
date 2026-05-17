import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { groqApiDevPlugin } from './vite-groq-api-plugin.js'

export default defineConfig(({ mode }) => {
  // Yalnızca GROQ_* — VITE_ olmayan değişkenler client bundle'a girmez
  const env = loadEnv(mode, process.cwd(), 'GROQ_')

  return {
    plugins: [tailwindcss(), react(), groqApiDevPlugin(env)],
  }
})

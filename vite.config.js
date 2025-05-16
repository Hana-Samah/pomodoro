import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: '/pomodoro/', // اسم المستودع
  plugins: [svelte()],
})

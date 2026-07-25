import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

function getCommitDate() {
  try {
    return execSync('git log -1 --format=%cd --date=format:"%B %d, %Y"').toString().trim()
  } catch {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
}

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    __COMMIT_DATE__: JSON.stringify(getCommitDate()),
  },
  build: {
    outDir: 'dist',
  },
})

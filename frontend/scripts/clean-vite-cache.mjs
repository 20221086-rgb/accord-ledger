import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cacheDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', '.vite')

fs.rmSync(cacheDir, { recursive: true, force: true })
console.log('Cleared Vite cache:', cacheDir)

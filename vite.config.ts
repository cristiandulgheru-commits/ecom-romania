import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { processOrderPayload } from './lib/orderHandler'

function orderApiMiddleware() {
  return {
    name: 'order-api',
    configureServer(server: { middlewares: { use: (path: string, fn: unknown) => void } }) {
      server.middlewares.use(
        '/api/orders',
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Metodă nepermisă' }))
            return
          }
          const chunks: Buffer[] = []
          req.on('data', (c) => chunks.push(c as Buffer))
          req.on('end', async () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf8')
              const body = JSON.parse(raw || '{}') as unknown
              const result = await processOrderPayload(body)
              res.setHeader('Content-Type', 'application/json')
              if ('error' in result && result.error) {
                res.statusCode = 400
                res.end(JSON.stringify(result))
                return
              }
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (e) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  error: e instanceof Error ? e.message : 'Eroare server',
                }),
              )
            }
          })
          req.on('error', next)
        },
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

  return {
    plugins: [tailwindcss(), react(), orderApiMiddleware()],
  }
})

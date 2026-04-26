import type { VercelRequest, VercelResponse } from '@vercel/node'
import { processOrderPayload } from '../lib/orderHandler'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodă nepermisă' })
  }

  const body = req.body
  const result = await processOrderPayload(body)
  if ('error' in result && result.error) {
    return res.status(400).json(result)
  }
  return res.status(200).json(result)
}

import { dbHealth } from '../../../src/lib/health'

export async function GET() {
  const info = await dbHealth(true)
  return new Response(JSON.stringify(info), {
    headers: { 'Content-Type': 'application/json' }
  })
}
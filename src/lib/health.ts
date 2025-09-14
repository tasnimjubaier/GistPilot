import { getPool } from './db'

export async function dbHealth(checkDb = false) {
  const hasEnv = !!process.env.DATABASE_URL
  if (!checkDb || !hasEnv) {
    return { ok: hasEnv, databaseUrl: hasEnv ? 'present' : 'missing' }
  }
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT 1 as ok')
    return { ok: true, ping: (rows as any)[0]?.ok === 1 }
  } catch (e:any) {
    return { ok: false, error: e?.message || 'db error' }
  }
}
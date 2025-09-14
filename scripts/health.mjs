// scripts/health.mjs
import mysql from 'mysql2/promise'

function parseMysqlUrl(url) {
  const u = new URL(url)
  const user = decodeURIComponent(u.username)
  const password = decodeURIComponent(u.password)
  const host = u.hostname
  const defaultPort = host.endsWith('tidbcloud.com') ? 4000 : 3306
  const port = u.port ? Number(u.port) : defaultPort
  const database = u.pathname.replace(/^\//, '')
  const sslParam = (u.searchParams.get('sslaccept') || '').toLowerCase()
  const isTiDBCloud = host.endsWith('tidbcloud.com')
  const rejectUnauthorized = sslParam === 'strict' || (isTiDBCloud && sslParam !== 'accept')
  const ssl = { minVersion: 'TLSv1.2', rejectUnauthorized }
  return { host, port, user, password, database, ssl }
}

async function dbHealth() {
  const hasEnv = !!process.env.DATABASE_URL
  if (!hasEnv) return { ok: false, databaseUrl: 'missing' }
  try {
    const conn = parseMysqlUrl(process.env.DATABASE_URL)
    const pool = mysql.createPool({ ...conn })
    const [rows] = await pool.query('SELECT 1 as ok')
    return { ok: true, ping: rows?.[0]?.ok === 1 }
  } catch (e) {
    return { ok: false, error: e?.message || 'db error' }
  }
}

console.log(JSON.stringify(await dbHealth(), null, 2))

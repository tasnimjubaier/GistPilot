// src/lib/db.ts
import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function parseMysqlUrl(url: string) {
  const u = new URL(url)

  const user = decodeURIComponent(u.username)
  const password = decodeURIComponent(u.password)
  const host = u.hostname

  // Default TiDB Cloud port to 4000 when not provided
  const defaultPort = host.endsWith('tidbcloud.com') ? 4000 : 3306
  const port = u.port ? Number(u.port) : defaultPort

  const database = u.pathname.replace(/^\//, '')

  // Enforce TLS for TiDB Cloud (and default to TLS in general)
  const sslParam = (u.searchParams.get('sslaccept') || '').toLowerCase()
  const isTiDBCloud = host.endsWith('tidbcloud.com')

  // If sslaccept=strict → verify cert, else still use TLS but allow default verification
  const rejectUnauthorized =
    sslParam === 'strict' || (isTiDBCloud && sslParam !== 'accept')

  const ssl: mysql.SslOptions = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized
  }

  return { host, port, user, password, database, ssl }
}

export function getPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  const conn = parseMysqlUrl(url)
  pool = mysql.createPool({
    ...conn,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: 'Z',
    dateStrings: true,
  })
  return pool
}

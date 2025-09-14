// scripts/migrate.mjs
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

async function getPool() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  const conn = parseMysqlUrl(url)
  return mysql.createPool({
    ...conn,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: 'Z',
    dateStrings: true,
  })
}

async function migrate() {
  const pool = await getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(36) PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      outline_json JSON NOT NULL,
      status ENUM('PENDING','READY','FAILED') DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modules (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      ord INT NOT NULL,
      CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id VARCHAR(36) PRIMARY KEY,
      module_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content MEDIUMTEXT NOT NULL,
      ord INT NOT NULL,
      embedding_json JSON NULL,
      CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )
  `)
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('[migrate] DATABASE_URL not set. Skipping.')
    return
  }
  try {
    await migrate()
    console.log('[migrate] done')
  } catch (e) {
    console.error('[migrate] error:', e?.message || e)
    process.exit(1)
  }
}
await main()

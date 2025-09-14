import { getPool } from '../lib/db'

export async function getCourseWithContent(id: string) {
  if (!process.env.DATABASE_URL) return { ok: false, error: 'DB not configured' } as const
  const pool = getPool()
  const [cs] = await pool.query('SELECT * FROM courses WHERE id = ?', [id])
  const course = (cs as any[])[0]
  if (!course) return { ok: false, error: 'not found' } as const

  const [mods] = await pool.query('SELECT * FROM modules WHERE course_id = ? ORDER BY ord ASC', [id])
  const modules = (mods as any[])

  for (const m of modules) {
    const [ls] = await pool.query('SELECT * FROM lessons WHERE module_id = ? ORDER BY ord ASC', [m.id])
    m.lessons = (ls as any[])
  }

  return { ok: true, course, modules } as const
}
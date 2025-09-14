
import { getPool } from '../lib/db'

export type CourseRow = {
  id: string, topic: string, status: 'PENDING'|'READY'|'FAILED',
  created_at: string, updated_at: string, modules: number, lessons: number
}

export async function listCourses(limit = 24, offset = 0): Promise<CourseRow[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const pool = getPool()
    const [rows] = await pool.query(`
      SELECT
        c.id, c.topic, c.status, c.created_at, c.updated_at,
        (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS modules,
        (
          SELECT COUNT(*) FROM lessons l WHERE l.module_id IN (
            SELECT id FROM modules WHERE course_id = c.id
          )
        ) AS lessons
      FROM courses c
      ORDER BY c.updated_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset])
    return rows as any
  } catch {
    return []
  }
}

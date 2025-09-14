// src/actions/create-course.ts
import { getPool } from '../lib/db'
import { migrate } from '../lib/migrate'
import { uuid } from '../lib/uuid'
import { getProvider } from '../llm'
import type { Outline } from '../llm/types'

type Ok = { ok: true; id: string }
type Err = { ok: false; status?: number; error: string }

export async function createCourse(topic: string): Promise<Ok | Err> {
  // DB must be configured
  if (!process.env.DATABASE_URL) {
    return { ok: false, status: 503, error: 'Configure DATABASE_URL in .env and run npm run migrate' }
  }

  

  try {
    console.log('calling migrate')
    // Ensure schema exists (idempotent)
    await migrate()

    const provider = getProvider()

    let outline: Outline
    try {
      outline = await provider.generateOutline(topic)
    } catch (e: any) {
      return { ok: false, status: 502, error: e?.message || 'LLM outline failed' }
    }
    console.log('outline ', outline)

    const courseId = uuid()
    const pool = getPool()

    // Create course row
    await pool.query(
      'INSERT INTO courses (id, topic, outline_json, status) VALUES (?, ?, CAST(? AS JSON), ?)',
      [courseId, topic, JSON.stringify(outline), 'PENDING'],
    )

    console.log('inserted into courses')

    // Create modules + lessons (limit to 4 x 3)
    let mCount = Math.min(outline.modules?.length ?? 0, 4)

    // test code: need to get rid of : start
    mCount = 1
    // test code: need to get rid of : end
    
    for (let m = 0; m < mCount; m++) {
      const mod = outline.modules[m]
      const moduleId = uuid()
      await pool.query(
        'INSERT INTO modules (id, course_id, title, description, ord) VALUES (?, ?, ?, ?, ?)',
        [moduleId, courseId, mod.title, mod.description || null, m],
      )
      console.log('inserted into modules- ', {m})

      let lCount = Math.min(mod.lessons?.length ?? 0, 3)

      // test code: need to get rid of : start
      lCount = 1
      // test code: need to get rid of : end

      for (let l = 0; l < lCount; l++) {
        const les = mod.lessons[l]
        let content = ''
        try {
          content = await provider.generateLesson(mod.title, les.title, topic)
        } catch (e: any) {
          // Keep course usable even if one lesson fails
          content = `Generation failed: ${e?.message || 'unknown error'}.`
        }
        const lessonId = uuid()
        await pool.query(
          'INSERT INTO lessons (id, module_id, title, content, ord, embedding_json) VALUES (?, ?, ?, ?, ?, ?)',
          [lessonId, moduleId, les.title, content, l, null],
        )
        console.log('inserted into pools- ', {m, l})
      }
    }

    await pool.query('UPDATE courses SET status = ? WHERE id = ?', ['READY', courseId])

    console.log('updated courses')

    return { ok: true, id: courseId }
  } catch (e: any) {
    console.error('[createCourse] error:', e)
    return { ok: false, status: 500, error: e?.message || 'createCourse failed' }
  }
}

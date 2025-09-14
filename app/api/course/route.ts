// app/api/course/route.ts
import { NextResponse } from 'next/server'
import { createCourse } from '../../../src/actions/create-course'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  console.log('received a request')
  try {
    const body = await req.json().catch(() => ({}))
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : ''
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }
    console.log('creating course', topic)
    const res = await createCourse(topic)
    console.log('course created')
    if (!res.ok) {
      const status = res.status ?? 500
      return NextResponse.json({ error: res.error ?? 'Failed to create course' }, { status })
    }

    return NextResponse.json({ id: res.id }, { status: 200 })
  } catch (e: any) {
    // Log to server console so you can see the real stack in your terminal
    console.error('[POST /api/course] Unhandled error:', e)
    return NextResponse.json(
      { error: e?.message ?? 'Unexpected error' },
      { status: 500 },
    )
  }
}

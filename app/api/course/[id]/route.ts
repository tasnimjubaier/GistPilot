// app/api/course/[id]/route.ts
import { NextResponse } from 'next/server'
import { getCourseWithContent } from '../../../../src/data/courses'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await getCourseWithContent(params.id)
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(res, { status: 200 })
  } catch (e: any) {
    console.error('[GET /api/course/:id] error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

import { getCourseWithContent } from '../../../src/data/courses'

export default async function CoursePage({ params }: { params: { id: string } }) {
  const res = await getCourseWithContent(params.id)
  if (!res.ok) {
    return <div className="card">Course not found.</div>
  }
  const { course, modules } = res
  return (
    <main>
      <h1>{course.topic}</h1>
      <p className="small hint">Status: {course.status}</p>
      <div style={{display:'grid', gap:12, marginTop:12}}>
        {modules.map((m:any) => (
          <div key={m.id} className="card">
            <h2>{m.title}</h2>
            {m.description && <p>{m.description}</p>}
            <ol>
              {m.lessons.map((l:any) => (
                <li key={l.id}>
                  <b>{l.title}</b>
                  <div style={{whiteSpace:'pre-wrap'}}>{l.content}</div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </main>
  )
}
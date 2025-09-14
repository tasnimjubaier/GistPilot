
import Link from 'next/link'

export type CourseMeta = {
  id: string
  topic: string
  status: 'PENDING' | 'READY' | 'FAILED'
  updated_at?: string
  modules?: number
  lessons?: number
}

export default function CourseCard({ c }: { c: CourseMeta }) {
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <h3 style={{margin:0, fontSize:16}}>{c.topic}</h3>
        <span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span>
      </div>
      <div className="small" style={{marginTop:6}}>
        {typeof c.modules === 'number' ? `${c.modules} modules` : ''}
        {typeof c.lessons === 'number' ? ` • ${c.lessons} lessons` : ''}
      </div>
      <div className="actions" style={{justifyContent:'space-between', marginTop:12}}>
        <Link className="btn" href={`/course/${c.id}`}>Open</Link>
        <span className="small">{c.updated_at?.slice(0,19).replace('T',' ') || ''}</span>
      </div>
    </div>
  )
}

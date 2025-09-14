
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCourseButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('Basics of Probability')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function create() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to create course')
      setOpen(false)
      router.push(`/course/${data.id}`)
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>New course</button>
      {open && (
        <div className="dialog-backdrop" onClick={() => !loading && setOpen(false)}>
          <div className="dialog" onClick={(e)=>e.stopPropagation()}>
            <h3 style={{marginTop:0}}>Create a new course</h3>
            <label>
              <div className="small">Topic</div>
              <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra" />
            </label>
            {error && <div className="small" style={{color:'#ef4444', marginTop:6}}>{error}</div>}
            <div className="actions">
              <button className="btn secondary" onClick={()=>!loading && setOpen(false)} disabled={loading}>Cancel</button>
              <button className="btn" onClick={create} disabled={loading}>{loading ? 'Creating…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

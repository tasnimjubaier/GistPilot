'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [topic, setTopic] = useState('Basics of Probability')
  const [courseId, setCourseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(setHealth).catch(()=>{})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setCourseId(null)
    try {
      console.log('calling api/course')
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      console.log('returned from api')
      const data = await res.json()
      console.log(data);
      if (!res.ok) throw new Error(data.error || 'Failed')
      setCourseId(data.id)
    } catch (err:any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="space-y-4">
      <h1>GistPilot</h1>
      <p className="small hint">TiDB storage only. LLM: mock by default; switch to Kimi via env.</p>
      {health && (
        <div className="card" style={{marginTop: 8}}>
          <b>Setup</b>
          <div className="mono" style={{whiteSpace:'pre-wrap', fontSize:12}}>
            {JSON.stringify(health, null, 2)}
          </div>
        </div>
      )}
      <form onSubmit={submit} className="card" style={{display:'flex', gap:8, alignItems:'center'}}>
        <input
          value={topic}
          onChange={e=>setTopic(e.target.value)}
          placeholder="Enter topic"
          style={{flex:1, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:8}}
          required
        />
        <button disabled={loading} style={{padding:'8px 16px', borderRadius:8, background:'#111827', color:'#fff'}}>
          {loading ? 'Generating…' : 'Create Course'}
        </button>
      </form>
      {error && <p className="err">{error}</p>}
      {courseId && (
        <p>Done — view your course: <a href={`/course/${courseId}`}>/course/{courseId}</a></p>
      )}
    </main>
  )
}
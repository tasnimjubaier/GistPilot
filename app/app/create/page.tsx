// app/app/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCoursePage() {
  const [topic, setTopic] = useState('Basics of Probability')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to create course')
      router.push(`/course/${data.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{marginBottom:12}}>Create a Course</h2>
      <form onSubmit={submit} className="card" style={{display:'flex', gap:8, alignItems:'center'}}>
        <input
          className="input"
          value={topic}
          onChange={e=>setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Linear Algebra)"
          required
        />
        <button className="btn" disabled={loading}>
          {loading ? 'Generating…' : 'Create Course'}
        </button>
      </form>
      {error && <p className="small" style={{color:'#ef4444', marginTop:8}}>{error}</p>}
    </div>
  )
}

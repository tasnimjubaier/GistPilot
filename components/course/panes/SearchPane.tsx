'use client'
import { useState } from 'react'
export default function SearchPane(){
  const [q, setQ] = useState('')
  return (
    <div>
      <input className="input" placeholder="Search in lesson (client-only)" value={q} onChange={e=>setQ(e.target.value)} />
      <p className="hint" style={{marginTop:8}}>Server/vector search coming later.</p>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
export default function NotesPane({ courseId, lessonId }: { courseId: string; lessonId?: string }){
  const key = `notes:${courseId}:${lessonId || 'course'}`
  const [t, setT] = useState('')
  useEffect(()=>{ try{ setT(localStorage.getItem(key) || '') }catch{} }, [key])
  function save(){ try{ localStorage.setItem(key, t) } catch {} }
  return (
    <div>
      <textarea className="input" rows={10} placeholder="Your notes…" value={t} onChange={e=>setT(e.target.value)} />
      <div className="actions"><button className="btn" onClick={save}>Save</button></div>
    </div>
  )
}

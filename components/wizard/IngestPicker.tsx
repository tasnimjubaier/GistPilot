'use client'
import { useRef, useState } from 'react'

type Uploaded = { id: string; name: string; bytes: number }
export default function IngestPicker({
  onUploaded
}:{ onUploaded: (files: Uploaded[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const open = () => ref.current?.click()

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const list = Array.from(e.target.files || [])
    if (!list.length) return
    try {
      setBusy(true)
      const fd = new FormData()
      for (const f of list) fd.append('files', f)
      const res = await fetch('/api/files/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      onUploaded(data.files || [])
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="hint">Attach materials (pdf, docx, md, txt, code, csv, html…)</div>
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
        <button type="button" className="btn" onClick={open} disabled={busy}>
          {busy ? 'Uploading…' : 'Upload files'}
        </button>
        <input ref={ref} type="file" onChange={onChange} multiple style={{display:'none'}} />
      </div>
      {error && <div className="small" style={{color:'#ef4444', marginTop:6}}>{error}</div>}
    </div>
  )
}

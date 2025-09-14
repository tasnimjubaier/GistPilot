'use client'

import { useRef, useState } from 'react'
export type PickedFile = { name: string; content: string; size: number }

export default function FilePicker({
  onPicked, maxFiles = 5, maxBytes = 1024*1024
}:{ onPicked:(files:PickedFile[])=>void; maxFiles?:number; maxBytes?:number }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string|null>(null)

  function open() { inputRef.current?.click() }

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (files.length > maxFiles) return setError(`Select up to ${maxFiles} files.`)
    let total = 0
    const outs: PickedFile[] = []
    for (const f of files) {
      total += f.size
      if (total > maxBytes) return setError('Files too large (max 1 MB total).')
      const text = await f.text().catch(()=> '')
      outs.push({ name: f.name, content: text.slice(0, 200_000), size: f.size })
    }
    onPicked(outs)
  }

  return (
    <div>
      <div className="hint">Optional files (txt, md, csv — 1MB total)</div>
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
        <button type="button" className="btn" onClick={open}>Choose files</button>
        <input ref={inputRef} type="file" onChange={onChange} multiple accept=".txt,.md,.csv,text/plain,text/markdown" style={{display:'none'}} />
      </div>
      {error && <div className="small" style={{color:'#ef4444', marginTop:6}}>{error}</div>}
    </div>
  )
}

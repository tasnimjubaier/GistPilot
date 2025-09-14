'use client'

// Minimal local type to avoid external deps
type Outline = { title?: string; modules?: { title: string; lessons?: { title: string }[] }[] }

export default function OutlinePreview({ outline }:{ outline: Outline | null }) {
  if (!outline) return <div className="panel"><div className="hint">No outline yet.</div></div>
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>{outline.title || 'Draft outline'}</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        {outline.modules?.map((m, i)=> (
          <div key={i} className="module">
            <div style={{fontWeight:600, marginBottom:4}}>{i+1}. {m.title}</div>
            <ol className="les" style={{paddingLeft:16}}>
              {m.lessons?.map((l, j)=> (<li key={j}>{l.title}</li>))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

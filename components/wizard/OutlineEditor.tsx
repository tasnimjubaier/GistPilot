
'use client'
import type { DraftOutline } from './types'

export default function OutlineEditor({ outline, onChange }:{ outline: DraftOutline; onChange:(o:DraftOutline)=>void }){
  function setTitle(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...outline, title: e.target.value })
  }
  function setModuleTitle(i:number, title:string){
    const modules = outline.modules.map((m, idx)=> idx===i ? { ...m, title } : m)
    onChange({ ...outline, modules })
  }
  function setLessonTitle(mi:number, li:number, title:string){
    const modules = outline.modules.map((m, idx)=> idx===mi ? { ...m, lessons: m.lessons.map((l, j)=> j===li ? { ...l, title } : l) } : m)
    onChange({ ...outline, modules })
  }

  return (
    <div className="panel">
      <label>
        <div className="hint">Course title</div>
        <input className="input" value={outline.title} onChange={setTitle} />
      </label>
      <div className="grid" style={{marginTop:8}}>
        {outline.modules.map((m, i)=> (
          <div className="module" key={i}>
            <h4>Module {i+1}</h4>
            <input className="input" value={m.title} onChange={e=>setModuleTitle(i, e.target.value)} />
            <div className="les" style={{marginTop:8}}>
              {m.lessons.map((l, j)=> (
                <input key={j} className="input" value={l.title} onChange={e=>setLessonTitle(i, j, e.target.value)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="hint" style={{marginTop:8}}>
        This is a preview outline for planning only. The backend will generate the final content.
      </p>
    </div>
  )
}


'use client'
export default function ProgressModal({ open, error, onClose }:{ open:boolean; error?:string|null; onClose:()=>void }){
  if (!open) return null
  return (
    <div className="modalbk" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>Generating…</h3>
        {!error ? (
          <>
            <progress max={100} />
            <p className="hint" style={{marginTop:8}}>We’re creating modules and lessons. This can take a moment.</p>
          </>
        ) : (
          <>
            <p style={{color:'#ef4444', marginBottom:8}}>{error}</p>
            <button className="btn" onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  )
}

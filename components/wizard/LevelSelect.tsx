'use client'

type Level = 'essentials' | 'core' | 'rigorous' | 'frontier'

const LABELS: Record<Level, {label:string; desc:string}> = {
  essentials: { label: 'Essentials', desc: 'Assumes no background; examples first.' },
  core:       { label: 'Core',       desc: 'Typical university core; some formalism.' },
  rigorous:   { label: 'Rigorous',   desc: 'Proofs, derivations, precise notation.' },
  frontier:   { label: 'Frontier',   desc: 'Research orientation; recent advances.' },
}

export default function LevelSelect({
  value, onChange
}: { value: Level; onChange: (v:Level)=>void }) {
  return (
    <div>
      <div className="hint">Depth preset</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:6}}>
        {(Object.keys(LABELS) as Level[]).map(k => {
          const active = value === k
          return (
            <button
              key={k}
              type="button"
              onClick={()=>onChange(k)}
              className="btn"
              style={{borderColor: active ? '#3b82f6' : undefined, background: active ? '#1e293b' : undefined, textAlign:'left', display:'block'}}
              title={LABELS[k].desc}
            >
              <div style={{fontWeight:600}}>{LABELS[k].label}</div>
              <div className="small">{LABELS[k].desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export type { Level }

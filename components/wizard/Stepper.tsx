
'use client'
export default function Stepper({ step, setStep, labels }:{ step:number; setStep:(n:number)=>void; labels:string[] }){
  return (
    <div className="stepper">
      {labels.map((l, i) => (
        <button
          type="button"
          key={i}
          className={`chip ${i===step ? 'active':''}`}
          onClick={() => setStep(i)}
        >
          {i+1}. {l}
        </button>
      ))}
    </div>
  )
}

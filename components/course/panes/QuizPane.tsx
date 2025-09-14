'use client'
import { useState } from 'react'
type Q = { q: string; a: string[]; correct: number }

export default function QuizPane({ courseId, moduleTitle }:{ courseId: string; moduleTitle?: string }){
  const [qs, setQs] = useState<Q[] | null>(null)
  const [score, setScore] = useState<number | null>(null)

  async function start(){
    const res = await fetch('/api/quiz/module', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ courseId, moduleTitle })
    })
    const data = await res.json().catch(()=>({}))
    setQs(data?.questions || [])
    setScore(null)
  }

  function grade(){
    if (!qs) return
    let s = 0
    qs.forEach((q,i)=>{
      const sel = (document.querySelector(`input[name="q${i}"]:checked`) as HTMLInputElement | null)
      if (!sel) return
      if (parseInt(sel.value, 10) === q.correct) s++
    })
    setScore(s)
  }

  return (
    <div className="quiz">
      {!qs ? (
        <div>
          <p className="hint">Generate a module test for the current section.</p>
          <button className="btn" onClick={start}>Start Test</button>
        </div>
      ) : (
        <div>
          {qs.map((q,i)=>(
            <div key={i} className="q">
              <div><b>{i+1}.</b> {q.q}</div>
              {q.a.map((opt, j)=>(
                <label key={j} className="opt">
                  <input type="radio" name={`q${i}`} value={j} /> {opt}
                </label>
              ))}
            </div>
          ))}
          <div className="actions">
            <button className="btn" onClick={grade}>Submit</button>
            {score!=null && <span className="hint">Score: {score}/{qs.length}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

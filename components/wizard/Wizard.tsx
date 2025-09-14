
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Stepper from './Stepper'
import OutlineEditor from './OutlineEditor'
import ProgressModal from './ProgressModal'
import type { DraftOutline } from './types'
import { draftFromTopic } from './types'

const STEP_LABELS = ['Topic & Goals', 'Style', 'Preview Outline', 'Generate']

export default function CreateWizard(){
  const [step, setStep] = useState(0)
  const [topic, setTopic] = useState('Basics of Probability')
  const [audience, setAudience] = useState<'beginner'|'intermediate'|'advanced'>('beginner')
  const [modules, setModules] = useState(4)
  const [lessons, setLessons] = useState(3)
  const [tone, setTone] = useState('clear, concise, example-driven')
  const [outline, setOutline] = useState<DraftOutline>(() => draftFromTopic('Basics of Probability', 4, 3))
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const preview = useMemo(() => draftFromTopic(topic || 'Untitled', modules, lessons), [topic, modules, lessons])

  function toPreview(){
    setOutline(preview)
    setStep(2)
  }

  async function generate(){
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, modules, lessons, tone }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to create course')
      router.push(`/course/${data.id}`)
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="wiz">
      <Stepper step={step} setStep={setStep} labels={STEP_LABELS} />

      {step === 0 && (
        <div className="panel">
          <div className="row">
            <label>
              <div className="hint">Topic</div>
              <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra" />
            </label>
            <label>
              <div className="hint">Audience</div>
              <select className="select" value={audience} onChange={e=>setAudience(e.target.value as any)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>
          <div className="row" style={{marginTop:8}}>
            <label>
              <div className="hint"># Modules</div>
              <input className="input" type="number" min={1} max={8} value={modules} onChange={e=>setModules(parseInt(e.target.value||'4'))} />
            </label>
            <label>
              <div className="hint">Lessons / module</div>
              <input className="input" type="number" min={1} max={8} value={lessons} onChange={e=>setLessons(parseInt(e.target.value||'3'))} />
            </label>
          </div>
          <div className="actions">
            <button className="btn" onClick={()=>setStep(1)}>Next</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="panel">
          <label>
            <div className="hint">Tone & Style</div>
            <textarea rows={4} defaultValue={tone} onChange={e=>setTone(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(0)}>Back</button>
            <button className="btn" onClick={toPreview}>Preview outline</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <OutlineEditor outline={outline} onChange={setOutline} />
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(1)}>Back</button>
            <button className="btn" onClick={()=>setStep(3)}>Continue</button>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="panel">
          <p className="hint">We’ll now generate the full course using your topic and preferences.</p>
          <ul className="hint" style={{paddingLeft:16}}>
            <li><b>Topic</b>: {topic}</li>
            <li><b>Audience</b>: {audience}</li>
            <li><b>Plan</b>: {modules} modules × {lessons} lessons</li>
            <li><b>Tone</b>: {tone}</li>
          </ul>
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(2)}>Back</button>
            <button className="btn" onClick={generate}>Generate course</button>
          </div>
        </div>
      )}

      <ProgressModal open={running || !!error} error={error} onClose={()=>{ setError(null); setRunning(false); }} />
    </div>
  )
}

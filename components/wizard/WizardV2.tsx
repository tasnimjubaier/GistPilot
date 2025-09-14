'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Stepper from './Stepper'
import LevelSelect, { type Level } from './LevelSelect'
import FilePicker, { type PickedFile } from './FilePicker'
import OutlinePreview from './OutlinePreview'
import ProgressModal from './ProgressModal'
import IngestPicker from './IngestPicker'

// Local Outline type (same shape used by API)
type Outline = { title?: string; modules?: { title: string; lessons?: { title: string }[] }[] }

const STEPS = ['Input', 'Outline', 'Generate'] as const

export default function CreateWizardV2(){
  const [step, setStep] = useState<number>(0)
  const [topic, setTopic] = useState('Basics of Probability')
  const [level, setLevel] = useState<Level>('core')
  const [uploads, setUploads] = useState<{id:string; name:string; bytes:number}[]>([])
  const [outline, setOutline] = useState<Outline | null>(null)
  const [comments, setComments] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const fileIds = uploads.map(u => u.id)
  async function draftOutline(){
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/outline/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, fileIds }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to draft outline')
      setOutline(data.outline || null)
      setStep(1)
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  async function iterateOutline(){
    if (!outline) return
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/outline/iterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, outline, comments }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to iterate outline')
      setOutline(data.outline || null)
      setComments('')
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  async function generateCourse(){
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend currently may ignore extras; included for future
        body: JSON.stringify({ topic, level, outline }),
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
      <Stepper step={step} setStep={setStep} labels={[...STEPS]} />

      {step === 0 && (
        <div className="panel">
          <label>
            <div className="hint">Topic</div>
            <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra — or upload files below" />
          </label>

          <div style={{marginTop:8}}>
            <LevelSelect value={level} onChange={setLevel} />
          </div>

          <div style={{marginTop:8}}>
            <IngestPicker onUploaded={(f)=> setUploads(prev => [...prev, ...f])} />
            {uploads.length > 0 && (
                <div className="hint" style={{marginTop:6}}>
                {uploads.length} file(s): {uploads.map(f=>f.name).join(', ')}
                </div>
            )}
          </div>


          <div className="actions">
            <button className="btn" onClick={draftOutline}>Draft outline</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <>
          <OutlinePreview outline={outline} />
          <div className="panel">
            <div className="hint">Comments to refine the outline</div>
            <textarea rows={4} className="input" value={comments} onChange={e=>setComments(e.target.value)} placeholder="e.g., Merge 1 & 2, add Bayes, reduce proofs." />
            <div className="actions">
              <button className="btn secondary" onClick={()=>setStep(0)}>Back</button>
              <button className="btn" onClick={iterateOutline}>Iterate</button>
              <button className="btn" onClick={()=>setStep(2)}>Finalize</button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="panel">
          <p className="hint">Ready to generate the full course based on the finalized outline.</p>
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(1)}>Back</button>
            <button className="btn" onClick={generateCourse}>Generate course</button>
          </div>
        </div>
      )}

      <ProgressModal open={running || !!error} error={error} onClose={()=>{ setError(null); setRunning(false); }} />
    </div>
  )
}

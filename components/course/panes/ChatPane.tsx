'use client'
import { useEffect, useRef, useState } from 'react'
import { useChatBridge } from '../InteractionProvider'
type Msg = { role:'user'|'assistant'|'system'; content:string }

export default function ChatPane({ courseId, lessonId }:{ courseId:string; lessonId?:string }){
  const [log, setLog] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bridge = useChatBridge()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bridge.setPrefillHandler((text: string) => {
      setInput(prev => (text + (prev ? prev : '')))
      inputRef.current?.focus()
    })
  }, [bridge])

  async function send(){
    if (!input.trim()) return
    const userMsg: Msg = { role:'user', content: input }
    setLog(prev => [...prev, userMsg])
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ courseId, lessonId, messages: [...log, userMsg] })
      })
      const data = await res.json().catch(()=>({}))
      const text = data?.reply || data?.text || '…'
      setLog(prev => [...prev, { role:'assistant', content: text }])
    } catch (e:any) {
      setLog(prev => [...prev, { role:'assistant', content: `Error: ${e?.message || e}` }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      <div className="log">
        {log.map((m,i)=> <div key={i} className="msg"><b>{m.role === 'user' ? 'You' : 'AI'}: </b>{m.content}</div>)}
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); send()}}>
        <textarea ref={inputRef} rows={3} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask a question or paste a selection…" />
        <button className="btn" type="submit" disabled={busy}>{busy?'Thinking…':'Send'}</button>
      </form>
    </div>
  )
}

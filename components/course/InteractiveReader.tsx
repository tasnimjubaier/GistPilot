'use client'
import { useEffect, useRef, useState } from 'react'
import { useSelection, useChatBridge } from './InteractionProvider'

export default function InteractiveReader({ children }: { children?: React.ReactNode }){
  const ref = useRef<HTMLDivElement>(null)
  const { selection, set, clear } = useSelection()
  const bridge = useChatBridge()
  const [localSel, setLocalSel] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function onUp(){
      const sel = window.getSelection()
      if (!sel) return
      const text = sel.toString().trim()
      if (text && el?.contains(sel.anchorNode) && text.length > 3) {
        set({ text }); setLocalSel(text)
      } else set(null)
    }
    el.addEventListener('mouseup', onUp)
    return () => el.removeEventListener('mouseup', onUp)
  }, [set])

  function askAI(){
    if (!selection?.text) return
    bridge.prefillAndFocus(`> ${selection.text}\n\n`)
    clear()
  }

  return (
    <div className="reader" ref={ref}>
      {selection && (
        <div className="selbar">
          <div className="txt">Selected: {localSel.slice(0,120)}{localSel.length>120?'…':''}</div>
          <button className="btn" onClick={askAI}>Ask AI</button>
          <button className="btn secondary" onClick={clear}>Dismiss</button>
        </div>
      )}
      {children}
    </div>
  )
}

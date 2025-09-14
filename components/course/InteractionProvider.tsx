'use client'
import { createContext, useContext, useRef, useState } from 'react'

type Bridge = { prefillAndFocus: (text: string) => void; setPrefillHandler: (fn: (text: string) => void) => void }
const ChatBridgeContext = createContext<Bridge | null>(null)
export function useChatBridge(){ const c = useContext(ChatBridgeContext); if(!c) throw new Error('useChatBridge outside provider'); return c }

type Sel = { text: string } | null
const SelectionContext = createContext<{ selection: Sel; clear: ()=>void; set: (s: Sel)=>void } | null>(null)
export function useSelection(){ const c = useContext(SelectionContext); if(!c) throw new Error('useSelection outside provider'); return c }

export default function InteractionProvider({ children }: { children: React.ReactNode }){
  const [selection, setSelection] = useState<Sel>(null)
  const handlerRef = useRef<(text: string) => void>(() => {})
  const bridge: Bridge = {
    prefillAndFocus: (text) => handlerRef.current?.(text),
    setPrefillHandler: (fn) => { handlerRef.current = fn },
  }
  return (
    <ChatBridgeContext.Provider value={bridge}>
      <SelectionContext.Provider value={{ selection, set: setSelection, clear: ()=>setSelection(null) }}>
        {children}
      </SelectionContext.Provider>
    </ChatBridgeContext.Provider>
  )
}

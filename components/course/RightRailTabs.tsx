'use client'
import { useState } from 'react'
import ChatPane from './panes/ChatPane'
import SearchPane from './panes/SearchPane'
import QuizPane from './panes/QuizPane'
import NotesPane from './panes/NotesPane' 

type Tab = 'search'|'quiz'|'notes'|'chat'
const TABS: { key: Tab; label: string }[] = [
  { key:'search', label:'Search' },
  { key:'quiz', label:'Quiz' },
  { key:'notes', label:'Notes' },
  { key:'chat', label:'Chat' },
]

export default function RightRailTabs({ courseId, lessonId, moduleTitle }:
  { courseId: string; lessonId?: string; moduleTitle?: string }){
  const [tab, setTab] = useState<Tab>('search')
  return (
    <div className="right pane">
      <div className="tabbar">
        {TABS.map(t => <button key={t.key} onClick={()=>setTab(t.key)} aria-selected={tab===t.key}>{t.label}</button>)}
      </div>
      {tab==='search' && <SearchPane />}
      {tab==='quiz' && <QuizPane courseId={courseId} moduleTitle={moduleTitle} />}
      {tab==='notes' && <NotesPane courseId={courseId} lessonId={lessonId} />}
      {tab==='chat' && <ChatPane courseId={courseId} lessonId={lessonId} />}
    </div>
  )
}

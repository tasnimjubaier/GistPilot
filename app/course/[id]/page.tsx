import { getCourseWithContent } from '../../../src/data/courses'
import '../../course/viewer.css'
import InteractionProvider from '../../../components/course/InteractionProvider'
import InteractiveReader from '../../../components/course/InteractiveReader'
import RightRailTabs from '../../../components/course/RightRailTabs'


export default async function CoursePage({ params }: { params: { id: string } }) {
  const res = await getCourseWithContent(params.id)

  const courseId = params.id
  const { course, modules } = res
  const firstModule = modules?.[0] ?? {}
  const firstLesson = firstModule?.lessons?.[0] ?? {}

  const currentLessonId = firstLesson.id ?? 'lesson-1'
  const currentModuleTitle = firstModule.title ?? 'Module 1'

  if (!res.ok) {
    return <div className="card">Course not found.</div>
  }
  
  return (
    <InteractionProvider>
      <div className="viewer">
        <aside className="pane left">
          <h3 style={{marginTop:0}}>Outline</h3>
          <ol style={{paddingLeft:16, margin:0}}>
            {modules?.map((m:any) => (
              <li key={m.id} style={{marginBottom:6}}>
                <div><b>{m.title}</b></div>
                <ul style={{paddingLeft:16, marginTop:4}}>
                  {(m.lessons||[]).map((l:any) => <li key={l.id}>{l.title}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </aside>
      
        <section className="pane center">
          <InteractiveReader>
            {firstLesson?.content ? (
              <article style={{whiteSpace:'pre-wrap'}}>{firstLesson.content}</article>
            ) : (
              <p className="hint">No lesson content yet.</p>
            )}
          </InteractiveReader>
        </section>
    
        <aside className="pane right">
          <RightRailTabs
            courseId={courseId}
            lessonId={currentLessonId}         // pass your real lesson id
            moduleTitle={currentModuleTitle}   // pass current module title
            />
        </aside>
      </div>
    </InteractionProvider>
  )
}
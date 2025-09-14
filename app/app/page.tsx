
import { listCourses } from '../../src/data/list-courses'
import CourseCard from '../../components/app/CourseCard'
import NewCourseButton from '../../components/app/NewCourseButton'

export default async function DashboardPage() {
  const courses = await listCourses(24, 0)

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:12}}>
        <h2 style={{margin:0}}>My Courses</h2>
        <NewCourseButton />
      </div>

      {courses.length === 0 ? (
        <div className="empty">
          No courses yet. Click <b>New course</b> to create your first one.
        </div>
      ) : (
        <div className="grid">
          {courses.map((c:any) => <CourseCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  )
}

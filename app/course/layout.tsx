// app/course/layout.tsx
export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', color: 'var(--fg)' }}>
      {children}
    </div>
  )
}
  
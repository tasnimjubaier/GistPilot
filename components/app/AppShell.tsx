
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../../app/app/app.css'

const nav = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/create', label: 'Create' },
  { href: '/app/library', label: 'Library' },
  { href: '/app/settings', label: 'Settings' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/app" className="brand">GistPilot</Link>
        <div className="nav-sec">Navigate</div>
        <div className="nav-list">
          {nav.map(n => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}


import type { ReactNode } from 'react'
import AppShell from '../../components/app/AppShell'
import Topbar from '../../components/app/Topbar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Topbar />
      {children}
    </AppShell>
  )
}

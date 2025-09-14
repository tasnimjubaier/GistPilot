import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0}}>
        <div style={{maxWidth:960, margin:'0 auto', padding:'16px'}}>
          {children}
        </div>
      </body>
    </html>
  )
}
import '../(public)/public.css'
import type { ReactNode } from 'react'
import NavbarPublic from '../../components/public/NavbarPublic'
import FooterPublic from '../../components/public/FooterPublic'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavbarPublic/>
      {children}
      <FooterPublic/>
    </div>
  )
}
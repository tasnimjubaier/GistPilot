'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '../../src/lib/site'

export default function NavbarPublic() {
  const pathname = usePathname()
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/">{site.name}</Link>
        <nav className="nav-links">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-primary" href={site.cta.href}>{site.cta.label}</Link>
        </div>
      </div>
    </header>
  )
}
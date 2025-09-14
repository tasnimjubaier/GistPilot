import Link from 'next/link'

export default function FooterPublic() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="muted">&copy; {new Date().getFullYear()} GistPilot</div>
        <nav className="footer-links">
          <Link href="/docs">Docs</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </div>
    </footer>
  )
}
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <h1>Generate structured courses from any topic.</h1>
        <p className="lead">GistPilot turns ideas into clean outlines and readable lessons—fast.</p>
        <div className="hero-actions">
          <Link href="/auth/login" className="btn btn-primary">Start free</Link>
          <Link href="/pricing" className="btn">See pricing</Link>
        </div>
      </div>
      <div className="hero-demo">
        <div className="demo-card">
          <div className="demo-title">Example</div>
          <div className="demo-body">
            <b>Topic:</b> Basics of Probability<br/>
            <b>Modules:</b> 4<br/>
            <b>Lessons:</b> 3 per module<br/>
          </div>
        </div>
      </div>
    </section>
  )
}
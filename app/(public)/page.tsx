import Hero from '../../components/public/Hero'

export default function LandingPage() {
  return (
    <main>
      <Hero/>
      <section className="container section grid-2">
        <div className="card">
          <h3>Why GistPilot?</h3>
          <p className="small">Ship courses faster: structured outlines, clean lessons, and tools to refine them.</p>
        </div>
        <div className="card">
          <h3>How it works</h3>
          <ol className="small" style={{paddingLeft:16}}>
            <li>Enter a topic & constraints</li>
            <li>Preview & edit the outline</li>
            <li>Generate lessons and quiz</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
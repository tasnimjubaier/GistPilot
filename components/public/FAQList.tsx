const faqs = [
  { q: 'What is GistPilot?', a: 'An AI-powered course generator that converts any topic into an outline and lessons.' },
  { q: 'Can I edit the outline?', a: 'Yes—reorder modules, rename lessons, and regenerate content as needed.' },
  { q: 'Which models do you support?', a: 'We use a pluggable provider—Kimi (K2) or any OpenAI-compatible API.' },
  { q: 'Do you store my data?', a: 'Courses are stored in TiDB in your project. You control the data.' },
]

export default function FAQList() {
  return (
    <section className="container">
      <h2 className="center">Frequently asked questions</h2>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <details key={i} className="faq">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
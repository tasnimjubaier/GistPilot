export default function PricingTable() {
  return (
    <section className="container">
      <h2 className="center">Simple pricing</h2>
      <div className="pricing">
        <div className="price-card">
          <div className="price-title">Free</div>
          <div className="price-amount">$0</div>
          <ul className="price-features">
            <li>Basic course generation</li>
            <li>5 courses / month</li>
            <li>Community support</li>
          </ul>
          <button className="btn btn-primary" disabled>Current</button>
        </div>
        <div className="price-card featured">
          <div className="price-title">Pro</div>
          <div className="price-amount">$19</div>
          <ul className="price-features">
            <li>Unlimited courses</li>
            <li>Search & quizzes</li>
            <li>Priority support</li>
          </ul>
          <a className="btn btn-primary" href="/auth/login">Upgrade</a>
        </div>
        <div className="price-card">
          <div className="price-title">Team</div>
          <div className="price-amount">$49</div>
          <ul className="price-features">
            <li>Teams & sharing</li>
            <li>Admin controls</li>
            <li>SAML SSO (soon)</li>
          </ul>
          <a className="btn" href="/auth/login">Contact sales</a>
        </div>
      </div>
    </section>
  )
}
export default function LoginStubPage() {
  return (
    <main className="container section">
      <h2>Sign in</h2>
      <div className="card" style={{marginTop:12}}>
        <p className="small">
          This is a safe stub. Hook your auth provider here (Auth0 / Auth.js / custom).
        </p>
        <ol className="small" style={{paddingLeft:16}}>
          <li>Create your provider app (callback URL: <code>https://your-domain.com/api/auth/callback</code>).</li>
          <li>Add env vars in <code>.env</code>.</li>
          <li>Wire provider routes under <code>app/api/auth/*</code> and protect app pages.</li>
        </ol>
        <p className="small">
          For now, you can continue without signing in and try the app features.
        </p>
      </div>
    </main>
  )
}
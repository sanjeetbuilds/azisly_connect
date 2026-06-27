import { Button, Input } from '../components'
import { CheckIcon } from '../components/icons.jsx'

const FEATURES = [
  'Structured interviews, scored consistently.',
  'Every verdict backed by evidence.',
  'From sourced to decided in one place.',
]

function Wordmark({ className = '' }) {
  return (
    <span className={`font-medium tracking-tight text-ink ${className}`}>
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}

/**
 * LoginScreen — a calm, centered login. Optional brand panel on the left,
 * a simple form on the right. No real auth: Sign in just enters the app.
 */
export default function LoginScreen({ onSignIn }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSignIn()
  }

  return (
    <div className="flex min-h-screen bg-background text-ink">
      {/* Brand panel */}
      <div className="relative hidden w-[44%] flex-col justify-between border-r border-hairline p-12 lg:flex">
        <Wordmark className="text-lg" />

        <div className="flex max-w-sm flex-col gap-7">
          <h2 className="text-[26px] leading-snug text-ink">
            Hiring decisions, judged on evidence.
          </h2>
          <ul className="flex flex-col gap-3.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-secondary">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-secondary">© Azisly</p>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <Wordmark className="mb-10 block text-center lg:hidden" />

          <div className="mb-8 flex flex-col gap-1.5">
            <h1 className="text-2xl text-ink">Sign in</h1>
            <p className="text-sm text-secondary">Welcome back to Azisly Recruit.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              defaultValue="aryan@acme.com"
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              defaultValue="password"
              placeholder="••••••••"
            />
            <Button type="submit" className="mt-1 w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">
            Accounts are created by your Azisly contact.
          </p>
        </div>
      </div>
    </div>
  )
}

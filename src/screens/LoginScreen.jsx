import { useState } from 'react'
import { Button, Input } from '../components'
import { CheckIcon } from '../components/icons.jsx'

const FEATURES = [
  'Structured interviews, scored consistently.',
  'Every verdict backed by evidence.',
  'From sourced to decided in one place.',
]

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function Wordmark({ className = '' }) {
  return (
    <span className={`font-medium tracking-tight text-ink ${className}`}>
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}

/**
 * LoginScreen — a calm, centered login with prototype-level validation.
 * Email is required and must look like an email; password is required. Use the
 * password "wrong" (or email wrong@acme.com) to see the wrong-credentials state.
 */
export default function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useState('aryan@acme.com')
  const [password, setPassword] = useState('password')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [authError, setAuthError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const eErr = !email.trim()
      ? 'Enter your email.'
      : !isEmail(email)
        ? 'Enter a valid email address.'
        : ''
    const pErr = !password ? 'Enter your password.' : ''

    setEmailError(eErr)
    setPasswordError(pErr)
    setAuthError('')
    if (eErr || pErr) return

    // Prototype auth: a specific fake credential fails so the state is visible.
    if (email.trim().toLowerCase() === 'wrong@acme.com' || password === 'wrong') {
      setAuthError('Wrong password, or no account with that email.')
      return
    }

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

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
                if (authError) setAuthError('')
              }}
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError('')
                if (authError) setAuthError('')
              }}
              placeholder="••••••••"
            />

            {authError && (
              <div className="rounded-lg border border-error/30 bg-error/[0.05] px-3 py-2 text-xs text-error">
                {authError}
              </div>
            )}

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

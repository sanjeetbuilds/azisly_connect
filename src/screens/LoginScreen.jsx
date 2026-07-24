import { useState } from 'react'
import { Button, Input, Checkbox, Wordmark, AuthBrandPanel } from '../components'
import { RECRUITER_ACCOUNT } from '../data/recruiterAccount.js'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/* Forgot password: always the same neutral message on submit, regardless of
   whether the email matches an account — never reveal which emails exist. */
function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const err = !email.trim()
      ? 'Enter your email.'
      : !isEmail(email)
        ? 'Enter a valid email address.'
        : ''
    setError(err)
    if (err) return
    setSent(true)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <Wordmark className="mb-10 block text-center lg:hidden" />
        <div className="mb-8 flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-ink">Check your email</h1>
          <p className="text-sm leading-relaxed text-secondary">
            If that email is registered, we&rsquo;ve sent a reset link.
          </p>
        </div>
        <Button variant="secondary" className="w-full" onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <Wordmark className="mb-10 block text-center lg:hidden" />
      <div className="mb-8 flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-ink">Forgot password?</h1>
        <p className="text-sm text-secondary">Enter your email and we&rsquo;ll send you a reset link.</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={error}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          placeholder="you@company.com"
        />
        <Button type="submit" className="mt-1 w-full">
          Send reset link
        </Button>
      </form>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 block w-full text-center text-sm text-secondary hover:text-ink"
      >
        Back to sign in
      </button>
    </div>
  )
}

/**
 * LoginScreen — a calm, centered login with prototype-level validation, plus
 * the Forgot password sub-flow (C1). Wrong credentials show one calm, generic
 * error that never reveals whether the email exists. `prefillEmail` and
 * `notice` are set after a successful Set Password / Reset Password redirect
 * (see App.jsx); `initialView="forgot"` is used to land directly on Forgot
 * password from an expired reset link.
 */
export default function LoginScreen({ onSignIn, prefillEmail, notice, initialView = 'signin' }) {
  const [view, setView] = useState(initialView) // 'signin' | 'forgot'
  const [email, setEmail] = useState(prefillEmail || RECRUITER_ACCOUNT.email)
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
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

    // One calm, generic error — never reveal whether the email exists.
    const matches =
      email.trim().toLowerCase() === RECRUITER_ACCOUNT.email.toLowerCase() &&
      password === RECRUITER_ACCOUNT.password
    if (!matches) {
      setAuthError('That email or password isn’t right.')
      return
    }

    onSignIn({ keepLoggedIn })
  }

  return (
    <div className="flex min-h-screen bg-background text-ink">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {view === 'forgot' ? (
          <ForgotPasswordForm onBack={() => setView('signin')} />
        ) : (
          <div className="w-full max-w-sm">
            <Wordmark className="mb-10 block text-center lg:hidden" />

            <div className="mb-8 flex flex-col gap-1.5">
              <h1 className="text-2xl font-bold text-ink">Sign in</h1>
              <p className="text-sm text-secondary">Welcome back to Azisly Recruit.</p>
            </div>

            {notice && (
              <div className="mb-5 rounded-lg border border-accent/25 bg-success-soft px-3 py-2 text-xs text-strong">
                {notice}
              </div>
            )}

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

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Keep me logged in"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-sm text-secondary hover:text-ink"
                >
                  Forgot password?
                </button>
              </div>

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
        )}
      </div>
    </div>
  )
}

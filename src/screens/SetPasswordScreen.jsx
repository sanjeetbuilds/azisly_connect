import { useState } from 'react'
import { Button, Input, Checkbox, Wordmark, AuthBrandPanel } from '../components'
import { CheckIcon, EyeIcon, EyeOffIcon } from '../components/icons.jsx'
import { PASSWORD_RULES, isPasswordValid } from '../lib/passwordRules.js'

/* A password field with a show/hide toggle. Mirrors Input's visual language
   (underline style, red on error) since the shared Input has no icon slot. */
function PasswordField({ label, value, onChange, show, onToggleShow, error, placeholder, autoComplete }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-secondary">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={
            'w-full bg-transparent border-b px-0.5 py-2 pr-8 ' +
            'text-[15px] text-ink placeholder:text-secondary/60 ' +
            'focus:outline-none transition-colors duration-200 ' +
            (error ? 'border-error focus:border-error' : 'border-hairline focus:border-ink')
          }
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary hover:text-ink"
        >
          {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}

function PasswordChecklist({ password }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password)
        return (
          <li
            key={rule.key}
            className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-strong' : 'text-secondary'}`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                met ? 'bg-accent-soft text-accent' : 'bg-ink/[0.04] text-muted'
              }`}
            >
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}

const COPY = {
  invite: {
    heading: 'Set your password',
    subtitle: 'Welcome to Azisly Recruit. Choose a password to activate your account.',
    cta: 'Set Password',
  },
  reset: {
    heading: 'Reset your password',
    subtitle: 'Choose a new password for your account.',
    cta: 'Reset Password',
  },
}

/**
 * SetPasswordScreen — the shared form behind both the invite (Set Password)
 * and reset (Reset Password) flows (C1). Email is prefilled from the link and
 * not editable. Only the heading, subtitle, and CTA label differ by mode; the
 * password rules, confirm-match check, and show/hide toggle are identical.
 * `mode="invite"` additionally requires the T&C checkbox (a fresh account);
 * `mode="reset"` does not re-ask for terms already accepted at invite time.
 */
export default function SetPasswordScreen({ email, mode = 'invite', onSuccess }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [touched, setTouched] = useState(false)

  const copy = COPY[mode] ?? COPY.invite
  const passwordOk = isPasswordValid(password)
  const confirmOk = confirmPassword.length > 0 && confirmPassword === password
  const canSubmit = passwordOk && confirmOk && (mode !== 'invite' || agreed)

  const confirmError = touched && confirmPassword.length > 0 && !confirmOk ? 'Passwords don’t match.' : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit) return
    onSuccess()
  }

  return (
    <div className="flex min-h-screen bg-background text-ink">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <Wordmark className="mb-10 block text-center lg:hidden" />

          <div className="mb-8 flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold text-ink">{copy.heading}</h1>
            <p className="text-sm text-secondary">{copy.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input label="Email" type="email" value={email} disabled readOnly className="cursor-not-allowed opacity-70" />

            <PasswordField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggleShow={() => setShowPassword((v) => !v)}
              autoComplete="new-password"
              placeholder="••••••••"
            />

            <PasswordChecklist password={password} />

            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setTouched(true)
              }}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((v) => !v)}
              error={confirmError}
              autoComplete="new-password"
              placeholder="••••••••"
            />
            {!confirmError && confirmOk && (
              <p className="-mt-3 text-xs text-strong">Passwords match.</p>
            )}

            {mode === 'invite' && (
              <Checkbox
                label="I agree to Azisly's Terms & Conditions and Privacy Policy."
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            )}

            <Button type="submit" className="mt-1 w-full" disabled={!canSubmit}>
              {copy.cta}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

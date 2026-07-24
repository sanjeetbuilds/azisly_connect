import { Button, Wordmark, AuthBrandPanel } from '../components'
import { ClockIcon } from '../components/icons.jsx'

/**
 * ExpiredLinkScreen — shown for an invalid or expired Set Password / Reset
 * Password link (C1). Same message and layout for both; only the recovery
 * action differs:
 *   - invite: no resend button here — resend is ops-only (part 1 of this
 *     build), so the recruiter is pointed at their Azisly rep.
 *   - reset: the recruiter can request a fresh reset link themselves, no ops
 *     involvement needed, so this variant links back to Forgot password.
 */
export default function ExpiredLinkScreen({ variant = 'invite', onRequestNewLink }) {
  return (
    <div className="flex min-h-screen bg-background text-ink">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm text-center">
          <Wordmark className="mb-10 block text-center lg:hidden" />

          <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
            <ClockIcon className="h-5 w-5" />
          </span>

          <h1 className="text-2xl font-bold text-ink">This link has expired</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Contact your Azisly rep to get a new one.
          </p>

          {variant === 'reset' && (
            <Button variant="primary" className="mt-6 w-full" onClick={onRequestNewLink}>
              Request a new link
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

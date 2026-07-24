import { useParams, useNavigate } from 'react-router-dom'
import SetPasswordScreen from '../screens/SetPasswordScreen.jsx'
import ExpiredLinkScreen from '../screens/ExpiredLinkScreen.jsx'
import { decodeToken } from '../lib/magicLink.js'

/**
 * /set-password/:token — the recruiter's invite landing, reached from the
 * Invited-transition welcome email (O2/o1 scope, not this one). A pasted link
 * opens a fresh tab with no app state, so the email is decoded from the token
 * alone. Any failure (bad token, wrong type, past expiry) renders the expired
 * view with no resend affordance — resend is ops-only (part 1).
 *
 * Submitting here is where O2's auto-activation trigger fires (status goes to
 * Active); this prototype has no shared backend account store to flip, so the
 * activation is represented by the redirect + "Account activated" notice on
 * the login screen the recruiter lands on next.
 */
export default function SetPasswordRoute() {
  const { token } = useParams()
  const navigate = useNavigate()
  const payload = decodeToken(token)

  const valid =
    Boolean(payload) &&
    payload.type === 'invite' &&
    typeof payload.exp === 'number' &&
    payload.exp > Date.now() &&
    Boolean(payload.email)

  if (!valid) {
    return <ExpiredLinkScreen variant="invite" />
  }

  return (
    <SetPasswordScreen
      email={payload.email}
      mode="invite"
      onSuccess={() =>
        navigate('/', {
          replace: true,
          state: { prefillEmail: payload.email, notice: 'Account activated. Sign in to continue.' },
        })
      }
    />
  )
}

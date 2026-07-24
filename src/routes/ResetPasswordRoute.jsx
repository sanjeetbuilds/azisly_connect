import { useParams, useNavigate } from 'react-router-dom'
import SetPasswordScreen from '../screens/SetPasswordScreen.jsx'
import ExpiredLinkScreen from '../screens/ExpiredLinkScreen.jsx'
import { decodeToken } from '../lib/magicLink.js'

/**
 * /reset-password/:token — reached from a recruiter-requested reset link
 * (Forgot password). Reuses SetPasswordScreen in "reset" mode: same email
 * lookup and validity rules as the invite link, just a different token type
 * and a shorter default lifetime (see buildResetLink). An expired/invalid
 * link here still gets the recruiter unstuck without ops: the expired screen
 * offers "Request a new link", landing back on Forgot password.
 */
export default function ResetPasswordRoute() {
  const { token } = useParams()
  const navigate = useNavigate()
  const payload = decodeToken(token)

  const valid =
    Boolean(payload) &&
    payload.type === 'reset' &&
    typeof payload.exp === 'number' &&
    payload.exp > Date.now() &&
    Boolean(payload.email)

  if (!valid) {
    return (
      <ExpiredLinkScreen
        variant="reset"
        onRequestNewLink={() => navigate('/', { replace: true, state: { openForgot: true } })}
      />
    )
  }

  return (
    <SetPasswordScreen
      email={payload.email}
      mode="reset"
      onSuccess={() =>
        navigate('/', {
          replace: true,
          state: { prefillEmail: payload.email, notice: 'Password updated, sign in.' },
        })
      }
    />
  )
}

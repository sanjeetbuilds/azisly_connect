import { useParams } from 'react-router-dom'
import ManagerFlow from '../screens/ManagerFlow.jsx'
import { decodeToken } from '../lib/magicLink.js'
import { seedRoles } from '../data/roles.js'
import { workspace } from '../data/candidates.js'

/**
 * /m/define/:token — the hiring manager's define-role landing. A pasted link
 * opens a fresh tab with no app state, so we decode the role and expiry from the
 * token alone and look the role up from the seed file (identical in every tab).
 * Any failure (bad token, unknown role, past expiry) renders the expired view.
 */
export default function ManagerDefineRoute() {
  const { token } = useParams()
  const payload = decodeToken(token)

  const role = payload ? seedRoles.find((r) => r.id === payload.roleId) : null
  const valid =
    Boolean(payload) &&
    payload.type === 'define' &&
    typeof payload.exp === 'number' &&
    payload.exp > Date.now() &&
    Boolean(role)

  return (
    <ManagerFlow
      expired={!valid}
      roleTitle={role?.title ?? 'this role'}
      company="Acme"
      recruiter={workspace.name}
      recruiterAvatar={workspace.avatar}
    />
  )
}

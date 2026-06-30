import { useParams } from 'react-router-dom'
import { decodeToken } from '../lib/magicLink.js'
import { seedRoles } from '../data/roles.js'
import { candidates } from '../data/candidates.js'
import { companyById } from '../data/companies.js'
import CandidateInterviewFlow from '../screens/CandidateInterviewFlow.jsx'
import CandidateInterviewLanding from '../screens/CandidateInterviewLanding.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatDate = (ms) => {
  const d = new Date(ms)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/**
 * /i/:token — the candidate's interview landing. A pasted link opens a fresh tab
 * with no recruiter login and no shared state, so everything is decoded from the
 * token and the role, company, and candidate are looked up from the seed by id.
 * This is the "interview" link type (the candidate takes it), distinct from the
 * "review" type (the recruiter or manager watches a completed interview). Any
 * failure (bad token, wrong type, past expiry, unknown ids) renders the expired
 * state with no role content.
 */
export default function CandidateInterviewRoute() {
  const { token } = useParams()
  const payload = decodeToken(token)

  const role = payload ? seedRoles.find((r) => r.id === payload.roleId) : null
  const candidate = payload ? candidates.find((c) => c.id === payload.candidateId) : null
  const valid =
    Boolean(payload) &&
    payload.type === 'interview' &&
    typeof payload.exp === 'number' &&
    payload.exp > Date.now() &&
    Boolean(role) &&
    Boolean(candidate)

  if (!valid) {
    return <CandidateInterviewLanding status="expired" />
  }

  return (
    <CandidateInterviewFlow
      role={role.title}
      company={companyById(payload.companyId).name}
      expiresOn={formatDate(payload.exp)}
    />
  )
}

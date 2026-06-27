import ManagerReviewScreen from './ManagerReviewScreen.jsx'
import ManagerEntryScreen from './ManagerEntryScreen.jsx'
import { candidates, workspace } from '../data/candidates.js'
import { interviews } from '../data/interviews.js'

/**
 * ManagerReviewFlow — entry for the manager's second magic link (?review=).
 * Expired links get the same polite message; otherwise the manager reviews the
 * recruiter's shortlist (the strong-verdict candidates).
 */
export default function ManagerReviewFlow({ token }) {
  if (token === 'expired') {
    return (
      <ManagerEntryScreen
        linkStatus="expired"
        recruiter={workspace.name}
        recruiterAvatar={workspace.avatar}
      />
    )
  }

  const shortlist = candidates.filter((c) => c.verdict === 'strong')

  return (
    <ManagerReviewScreen
      roleTitle="Senior Product Engineer"
      recruiter={workspace.name}
      candidates={shortlist}
      interviews={interviews}
    />
  )
}

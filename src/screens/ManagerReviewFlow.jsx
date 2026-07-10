import { useState } from 'react'
import ManagerReviewScreen from './ManagerReviewScreen.jsx'
import ManagerEntryScreen from './ManagerEntryScreen.jsx'
import { candidates, workspace } from '../data/candidates.js'
import { interviews } from '../data/interviews.js'

/**
 * ManagerReviewFlow — the manager's second magic link (?review=). A magic-link
 * welcome (Screen 11, review variant) → the candidate review. Expired or
 * invalid links get the polite message with no app content.
 */
export default function ManagerReviewFlow({ token }) {
  const [phase, setPhase] = useState('entry') // entry | review
  const shortlist = candidates.filter((c) => c.verdict === 'strong')

  if (phase === 'entry') {
    return (
      <ManagerEntryScreen
        kind="review"
        roleTitle="Product Engineer"
        recruiter={workspace.name}
        recruiterAvatar={workspace.avatar}
        company="Acme"
        candidateCount={shortlist.length}
        linkStatus={token === 'expired' ? 'expired' : 'valid'}
        onStart={() => setPhase('review')}
      />
    )
  }

  return (
    <ManagerReviewScreen
      roleTitle="Product Engineer"
      recruiter={workspace.name}
      candidates={shortlist}
      interviews={interviews}
    />
  )
}

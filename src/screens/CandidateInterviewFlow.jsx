import { useState } from 'react'
import CandidateInterviewLanding from './CandidateInterviewLanding.jsx'
import InterviewSetupScreen from './InterviewSetupScreen.jsx'

const MESSAGE_STATES = ['expired', 'filled', 'completed']

// Map the (preview) token to a starting point so engineers can deep-link each
// state. A real token would resolve to the same set.
function startFor(token) {
  if (token === 'warmup') return { stage: 'warmup', permission: 'ready' }
  if (token === 'setup-ready') return { stage: 'check', permission: 'ready' }
  if (token === 'setup-denied') return { stage: 'check', permission: 'denied' }
  if (token === 'setup') return { stage: 'check', permission: 'prompt' }
  return { stage: 'landing', permission: 'prompt' }
}

/**
 * CandidateInterviewFlow — the candidate side, from the magic-link landing
 * through the pre-interview setup. Holds the small amount of flow state so the
 * landing's "Continue to set up" leads into the setup stages.
 */
export default function CandidateInterviewFlow({
  token,
  role = 'Senior Product Engineer',
  company = 'Acme',
  expiresOn = 'Jul 12, 2026',
}) {
  const start = startFor(token)
  const [stage, setStage] = useState(start.stage) // landing | check | warmup

  if (MESSAGE_STATES.includes(token)) {
    return <CandidateInterviewLanding status={token} role={role} company={company} expiresOn={expiresOn} />
  }

  if (stage === 'landing') {
    return (
      <CandidateInterviewLanding
        status="valid"
        role={role}
        company={company}
        expiresOn={expiresOn}
        onContinue={() => setStage('check')}
      />
    )
  }

  return (
    <InterviewSetupScreen
      role={role}
      company={company}
      initialStage={stage === 'warmup' ? 'warmup' : 'check'}
      initialPermission={start.permission}
      onBack={() => setStage('landing')}
      onStartInterview={() => {}}
    />
  )
}

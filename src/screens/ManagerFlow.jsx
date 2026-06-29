import { useState } from 'react'
import { Card } from '../components'
import { CheckIcon } from '../components/icons.jsx'
import { workspace } from '../data/candidates.js'
import ManagerEntryScreen from './ManagerEntryScreen.jsx'
import DefineRoleScreen from './DefineRoleScreen.jsx'

function Wordmark() {
  return (
    <span className="font-medium tracking-tight text-ink">
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}

function ManagerTopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-hairline px-6">
      <Wordmark />
    </header>
  )
}

/**
 * ManagerFlow — the no-account hiring-manager journey reached via a magic link.
 * entry (Screen 11) → define (reuses Screen 4's DefineRoleScreen, no sidebar) →
 * done (the card is saved and sent back to the recruiter).
 */
export default function ManagerFlow({ token }) {
  const expired = token === 'expired'
  const [phase, setPhase] = useState('entry') // entry | define | done

  const roleTitle = 'Senior Backend Engineer'
  const recruiter = workspace.name
  const first = recruiter.split(' ')[0]

  if (phase === 'entry') {
    return (
      <ManagerEntryScreen
        roleTitle={roleTitle}
        recruiter={recruiter}
        recruiterAvatar={workspace.avatar}
        company="Acme"
        linkStatus={expired ? 'expired' : 'valid'}
        onStart={() => setPhase('define')}
      />
    )
  }

  if (phase === 'define') {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background text-ink">
        <ManagerTopBar />
        <DefineRoleScreen
          roleTitle={roleTitle}
          openings={1}
          reviewLabel="Save and send back to recruiter"
          onBack={() => setPhase('entry')}
          onComplete={() => setPhase('done')}
        />
      </div>
    )
  }

  // done — confirmation that the card was saved and sent back
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <ManagerTopBar />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="flex max-w-md flex-col items-center gap-5 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-strong/10 text-strong">
            <CheckIcon className="h-7 w-7" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl text-ink">Definition sent</h1>
            <p className="text-sm leading-relaxed text-secondary">
              Thanks, your definition has been sent to the recruiter. {first} will take it from here.
            </p>
          </div>
          <p className="text-xs text-secondary">You can close this tab.</p>
        </Card>
      </main>
    </div>
  )
}

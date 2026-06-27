import { useState } from 'react'
import { Sidebar } from './components'
import { workspace } from './data/candidates.js'
import { seedRoles, makeApprovedRole } from './data/roles.js'
import LoginScreen from './screens/LoginScreen.jsx'
import RolesScreen from './screens/RolesScreen.jsx'
import CreateRoleScreen from './screens/CreateRoleScreen.jsx'
import DefineRoleScreen from './screens/DefineRoleScreen.jsx'
import ReviewRoleScreen from './screens/ReviewRoleScreen.jsx'
import CandidatesScreen from './screens/CandidatesScreen.jsx'
import InviteScreen from './screens/InviteScreen.jsx'
import DecisionScreen from './screens/DecisionScreen.jsx'
import ManagerFlow from './screens/ManagerFlow.jsx'

// Magic-link entry: a hiring manager reaches the app via ?invite=<token>.
// Resolved once at load — there is no client routing.
const inviteToken = new URLSearchParams(window.location.search).get('invite')

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [view, setView] = useState('roles') // roles | create | define | review | candidates | invite | decision
  const [roles, setRoles] = useState(seedRoles)
  const [draft, setDraft] = useState(null) // { title, openings, method } from Create Role
  const [decisionCandidate, setDecisionCandidate] = useState(null)

  // Hiring-manager magic-link flow (no account, no sidebar).
  if (inviteToken !== null) {
    return <ManagerFlow token={inviteToken} />
  }

  if (!authed) {
    return (
      <LoginScreen
        onSignIn={() => {
          setAuthed(true)
          setView('roles')
        }}
      />
    )
  }

  const addRole = () => {
    const cfg = draft ?? { title: 'New role', openings: 1, method: 'self' }
    setRoles((prev) => [makeApprovedRole(`role-${prev.length + 1}`, cfg.title), ...prev])
  }

  const activeNav = ['candidates', 'invite', 'decision'].includes(view) ? 'Candidates' : 'Roles'

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      <Sidebar
        active={activeNav}
        onNavigate={(item) => setView(item === 'Roles' ? 'roles' : 'candidates')}
        onNewRole={() => setView('create')}
        workspace={workspace}
      />

      {view === 'roles' && (
        <RolesScreen
          roles={roles}
          onCreateRole={() => setView('create')}
          onOpenRole={() => setView('candidates')}
        />
      )}

      {view === 'create' && (
        <CreateRoleScreen
          onCancel={() => setView('roles')}
          onContinue={(cfg) => {
            setDraft(cfg)
            setView('define')
          }}
        />
      )}

      {view === 'define' && (
        <DefineRoleScreen
          roleTitle={draft?.title ?? 'New role'}
          openings={draft?.openings ?? 1}
          onBack={() => setView('create')}
          onComplete={() => setView('review')}
        />
      )}

      {view === 'review' && (
        <ReviewRoleScreen
          roleTitle={draft?.title ?? 'New role'}
          openings={draft?.openings ?? 1}
          onBack={() => setView('define')}
          onApprove={addRole}
          onStartSourcing={() => {
            setDraft(null)
            setView('candidates')
          }}
          onBackToRoles={() => {
            setDraft(null)
            setView('roles')
          }}
        />
      )}

      {view === 'candidates' && (
        <CandidatesScreen
          onInvite={() => setView('invite')}
          onDecide={(candidate) => {
            setDecisionCandidate(candidate)
            setView('decision')
          }}
        />
      )}

      {view === 'invite' && (
        <InviteScreen roleTitle="Senior Product Engineer" onBack={() => setView('candidates')} />
      )}

      {view === 'decision' && (
        <DecisionScreen
          candidate={decisionCandidate ?? undefined}
          onBack={() => setView('candidates')}
          onDone={() => setView('candidates')}
        />
      )}
    </div>
  )
}

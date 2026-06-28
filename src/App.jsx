import { useState } from 'react'
import { Sidebar } from './components'
import { candidates, workspace } from './data/candidates.js'
import { interviews } from './data/interviews.js'
import { seedRoles, makeApprovedRole } from './data/roles.js'
import LoginScreen from './screens/LoginScreen.jsx'
import RolesScreen from './screens/RolesScreen.jsx'
import CreateRoleScreen from './screens/CreateRoleScreen.jsx'
import DefineRoleScreen from './screens/DefineRoleScreen.jsx'
import ReviewRoleScreen from './screens/ReviewRoleScreen.jsx'
import CandidatesScreen from './screens/CandidatesScreen.jsx'
import ManagerDecisionScreen from './screens/ManagerDecisionScreen.jsx'
import InviteScreen from './screens/InviteScreen.jsx'
import InviteManagerScreen from './screens/InviteManagerScreen.jsx'
import DecisionScreen from './screens/DecisionScreen.jsx'
import ManagerFlow from './screens/ManagerFlow.jsx'
import ManagerReviewFlow from './screens/ManagerReviewFlow.jsx'

// Magic-link entries: a hiring manager reaches the app via ?invite=<token>
// (define a role) or ?review=<token> (review the shortlist). Resolved once at
// load — there is no client routing.
const params = new URLSearchParams(window.location.search)
const inviteToken = params.get('invite')
const reviewToken = params.get('review')

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [view, setView] = useState('roles') // roles | create | define | review | candidates | invite | decision
  const [roles, setRoles] = useState(seedRoles)
  const [draft, setDraft] = useState(null) // { title, openings, method } from Create Role
  const [decisionCandidate, setDecisionCandidate] = useState(null)

  // Hiring-manager magic-link flows (no account, no sidebar).
  if (reviewToken !== null) {
    return <ManagerReviewFlow token={reviewToken} />
  }
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

  const activeNav = ['candidates', 'invite', 'decision', 'manager-decision'].includes(view)
    ? 'Candidates'
    : 'Roles'

  const shortlist = candidates.filter((c) => c.verdict === 'strong')
  const approvedIds = ['maya-okonkwo', 'hana-kim'] // the manager's picks

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
            setView(cfg.method === 'invite' ? 'invite-manager' : 'define')
          }}
        />
      )}

      {view === 'invite-manager' && (
        <InviteManagerScreen
          roleTitle={draft?.title ?? 'this role'}
          onCancel={() => setView('create')}
          onDone={() => {
            setDraft(null)
            setView('roles')
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
          managerResponse={{
            manager: 'Anjali Rao',
            roleTitle: 'Senior Product Engineer',
            approvedCount: approvedIds.length,
            onView: () => setView('manager-decision'),
          }}
        />
      )}

      {view === 'manager-decision' && (
        <ManagerDecisionScreen
          manager="Anjali Rao"
          roleTitle="Senior Product Engineer"
          candidates={shortlist}
          approvedIds={approvedIds}
          interviews={interviews}
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

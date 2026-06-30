import { useState } from 'react'
import { Sidebar } from './components'
import { candidates, workspace, roleTotals } from './data/candidates.js'
import { interviews } from './data/interviews.js'
import { seedRoles, makeRole } from './data/roles.js'
import LoginScreen from './screens/LoginScreen.jsx'
import RolesScreen from './screens/RolesScreen.jsx'
import CreateRoleScreen from './screens/CreateRoleScreen.jsx'
import DefineRoleScreen from './screens/DefineRoleScreen.jsx'
import ReviewRoleScreen from './screens/ReviewRoleScreen.jsx'
import CandidatesScreen from './screens/CandidatesScreen.jsx'
import ManagerDecisionScreen from './screens/ManagerDecisionScreen.jsx'
import InviteScreen from './screens/InviteScreen.jsx'
import InviteManagerScreen from './screens/InviteManagerScreen.jsx'
import SubmitMatchScreen from './screens/SubmitMatchScreen.jsx'
import DecisionScreen from './screens/DecisionScreen.jsx'
import ManagerFlow from './screens/ManagerFlow.jsx'
import ManagerReviewFlow from './screens/ManagerReviewFlow.jsx'
import CandidateInterviewFlow from './screens/CandidateInterviewFlow.jsx'

// Magic-link entries: a hiring manager reaches the app via ?invite=<token>
// (define a role) or ?review=<token> (review the shortlist). Resolved once at
// load — there is no client routing.
const params = new URLSearchParams(window.location.search)
const inviteToken = params.get('invite')
const reviewToken = params.get('review')
const interviewToken = params.get('interview')

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [view, setView] = useState('roles') // roles | create | define | review | candidates | invite | decision
  const [roles, setRoles] = useState(seedRoles)
  const [draft, setDraft] = useState(null) // { title, openings, define_by, approve_by, manager }
  const [decisionCandidate, setDecisionCandidate] = useState(null)
  const [submitRole, setSubmitRole] = useState(null) // the defined role being submitted for matching
  const [openRole, setOpenRole] = useState(null) // the role whose candidate pipeline is open

  // Candidate interview flow (public, no account): landing then pre-interview
  // setup. The token value selects the state for preview; a real token would be
  // decoded to the same set.
  if (interviewToken !== null) {
    return (
      <CandidateInterviewFlow
        token={interviewToken}
        role="Senior Product Engineer"
        company="Acme"
        expiresOn="Jul 12, 2026"
      />
    )
  }

  // Hiring-manager magic-link flows (no account, no sidebar).
  if (reviewToken !== null) {
    return <ManagerReviewFlow token={reviewToken} />
  }
  if (inviteToken !== null) {
    return (
      <ManagerFlow
        expired={inviteToken === 'expired'}
        roleTitle={seedRoles[0].title}
        company="Acme"
      />
    )
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
    const cfg = draft ?? { title: 'New role', define_by: 'recruiter', approve_by: 'hiring_manager' }
    setRoles((prev) => [makeRole(`role-${prev.length + 1}`, cfg), ...prev])
  }

  const activeNav = ['candidates', 'invite', 'decision', 'manager-decision'].includes(view)
    ? 'Candidates'
    : 'Roles'

  // What the manager reviewed and decided, derived from the lifecycle so the
  // decision screen always shows every pick (any verdict can be taken forward).
  const reviewed = candidates.filter((c) =>
    ['Shared', 'Taken forward', 'Passed'].includes(c.stage),
  )
  const approvedIds = candidates.filter((c) => c.stage === 'Taken forward').map((c) => c.id)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      <Sidebar
        active={activeNav}
        onNavigate={(item) => {
          if (item === 'Roles') setView('roles')
          else {
            setOpenRole(null) // the global pipeline defaults to the Senior Product Engineer role
            setView('candidates')
          }
        }}
        onNewRole={() => setView('create')}
        workspace={workspace}
      />

      {view === 'roles' && (
        <RolesScreen
          roles={roles.map((r) =>
            // The scoped role's counts derive from the candidate list, so the
            // Roles number agrees with the Candidates title and ready count.
            r.id === 'r-spe'
              ? { ...r, totalCandidates: roleTotals.total, candidatesReady: roleTotals.readyToReview }
              : r,
          )}
          onCreateRole={() => setView('create')}
          onOpenRole={(role) => {
            // A defined role goes to submit-and-match; everything else opens its
            // candidate pipeline, which reads the role's approve_by flag.
            if (role.state === 'defined') {
              setSubmitRole(role)
              setView('submit-match')
            } else {
              setOpenRole(role)
              setView('candidates')
            }
          }}
          defineNotice={{
            // A hiring manager finished defining a role via magic link.
            manager: 'Tom',
            roleTitle: 'Engineering Manager',
            onReview: () => {
              const em = roles.find((r) => r.id === 'r-em')
              if (em) setSubmitRole(em)
              setView('submit-match')
            },
          }}
        />
      )}

      {view === 'create' && (
        <CreateRoleScreen
          onCancel={() => setView('roles')}
          onContinue={(cfg) => {
            setDraft(cfg)
            // The define_by switch decides who writes the definition.
            setView(cfg.define_by === 'hiring_manager' ? 'invite-manager' : 'define')
          }}
        />
      )}

      {view === 'invite-manager' &&
        (() => {
          // The define link must reference a role in the seed file (the token
          // carries roleId, and the manager tab looks it up from seed).
          const inviteRole = seedRoles.find((r) => r.title === draft?.title) ?? seedRoles[0]
          return (
            <InviteManagerScreen
              roleId={inviteRole.id}
              roleTitle={inviteRole.title}
              preset={draft?.manager ?? null}
              onCancel={() => setView('create')}
              onDone={() => {
                setDraft(null)
                setView('roles')
              }}
            />
          )
        })()}

      {view === 'submit-match' && submitRole && (
        <SubmitMatchScreen
          role={submitRole}
          candidates={candidates.filter((c) => c.verdict)}
          onBack={() => setView('roles')}
          onComplete={() => {
            const matched = candidates.filter((c) => c.verdict).length
            setRoles((prev) =>
              prev.map((r) =>
                r.id === submitRole.id
                  ? { ...r, state: 'ready', candidatesReady: matched, totalCandidates: matched }
                  : r,
              ),
            )
          }}
          onReviewCandidates={() => setView('candidates')}
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

      {view === 'candidates' &&
        (() => {
          const pipelineRole = openRole ?? roles.find((r) => r.id === 'r-spe')
          return (
            <CandidatesScreen
              approveBy={pipelineRole?.approve_by ?? 'hiring_manager'}
              roleTitle={pipelineRole?.title ?? 'Senior Product Engineer'}
              managerResponse={{ manager: 'Anjali Rao', approvedCount: approvedIds.length }}
              onInvite={() => setView('invite')}
            />
          )
        })()}

      {view === 'manager-decision' && (
        <ManagerDecisionScreen
          manager="Anjali Rao"
          roleTitle="Senior Product Engineer"
          candidates={reviewed}
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

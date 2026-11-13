import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './components'
import { candidates, workspace, roleTotals } from './data/candidates.js'
import { interviews } from './data/interviews.js'
import { seedRoles, makeRole } from './data/roles.js'
import { PLAN_LIMITS } from './data/plan.js'
import LoginScreen from './screens/LoginScreen.jsx'
import RolesScreen from './screens/RolesScreen.jsx'
import UpgradeScreen from './screens/UpgradeScreen.jsx'
import CreateRoleScreen from './screens/CreateRoleScreen.jsx'
import DefineRoleScreen from './screens/DefineRoleScreen.jsx'
import ReviewRoleScreen from './screens/ReviewRoleScreen.jsx'
import InterviewQuestionsScreen from './screens/InterviewQuestionsScreen.jsx'
import { matchFamily } from './data/roleFamilies.js'
import CandidatesScreen from './screens/CandidatesScreen.jsx'
import ManagerDecisionScreen from './screens/ManagerDecisionScreen.jsx'
import InviteScreen from './screens/InviteScreen.jsx'
import InviteManagerScreen from './screens/InviteManagerScreen.jsx'
import SubmitMatchScreen from './screens/SubmitMatchScreen.jsx'
import DecisionScreen from './screens/DecisionScreen.jsx'
import ManagerFlow from './screens/ManagerFlow.jsx'
import ManagerReviewFlow from './screens/ManagerReviewFlow.jsx'
import CandidateInterviewFlow from './screens/CandidateInterviewFlow.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'

// Magic-link entries: a hiring manager reaches the app via ?invite=<token>
// (define a role) or ?review=<token> (review the shortlist). Resolved once at
// load — there is no client routing.
const params = new URLSearchParams(window.location.search)
const inviteToken = params.get('invite')
const reviewToken = params.get('review')
const interviewToken = params.get('interview')

// "Keep me logged in" persistence (C1): localStorage survives a browser
// restart, sessionStorage clears when the tab closes. Both are read at mount
// so a Set Password / Reset Password redirect and a plain refresh behave the
// same way.
const AUTH_KEY = 'azisly.recruit.authed'
const loadAuthed = () =>
  localStorage.getItem(AUTH_KEY) === '1' || sessionStorage.getItem(AUTH_KEY) === '1'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(loadAuthed)
  const [view, setView] = useState('roles') // roles | create | define | review | candidates | invite | decision | profile
  const [roles, setRoles] = useState(seedRoles)
  const [draft, setDraft] = useState(null) // { title, openings }
  const [draftProbes, setDraftProbes] = useState([]) // probes captured while defining, carried to Review
  const [draftQuestions, setDraftQuestions] = useState(null) // recruiter-edited interview questions; null = suggested
  const [decisionCandidate, setDecisionCandidate] = useState(null)
  const [submitRole, setSubmitRole] = useState(null) // the defined role being submitted for matching
  const [openRole, setOpenRole] = useState(null) // the role whose candidate pipeline is open
  const [runMatch, setRunMatch] = useState(false) // show the matching animation only on first submit

  // Plan limits. plan is normally fixed per account; it's toggleable here only
  // so both the free and paid experiences are reachable in this prototype.
  const [plan, setPlan] = useState('free')
  // Lifetime jobs submitted — never decremented by closing or discarding a role.
  const [jobsEverSubmitted, setJobsEverSubmitted] = useState(seedRoles.length)
  // Interview credits are account-wide, shared across every role, and tracked
  // per plan so switching the demo toggle shows each tier's own usage.
  const [creditsUsed, setCreditsUsed] = useState({ free: 4, paid: 12 })

  const jobLimitReached = jobsEverSubmitted >= PLAN_LIMITS[plan].jobs
  const creditLimit = PLAN_LIMITS[plan].interviews
  const creditsUsedForPlan = creditsUsed[plan]

  const consumeCredits = (n = 1) =>
    setCreditsUsed((prev) => ({ ...prev, [plan]: Math.min(PLAN_LIMITS[plan].interviews, prev[plan] + n) }))
  const refundCredit = () => setCreditsUsed((prev) => ({ ...prev, [plan]: Math.max(0, prev[plan] - 1) }))
  const goUpgrade = () => setView('upgrade')

  // Candidate interview flow (public, no account): landing then pre-interview
  // setup. The token value selects the state for preview; a real token would be
  // decoded to the same set.
  if (interviewToken !== null) {
    return (
      <CandidateInterviewFlow
        token={interviewToken}
        role="Product Engineer"
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
    // Use a role whose title resolves to a family, so the define screen never
    // renders a blank domain.
    const invitedRole = seedRoles.find((r) => matchFamily(r.title)) ?? seedRoles[0]
    return (
      <ManagerFlow
        expired={inviteToken === 'expired'}
        roleTitle={invitedRole.title}
        company="Acme"
      />
    )
  }

  if (!authed) {
    return (
      <LoginScreen
        prefillEmail={location.state?.prefillEmail}
        notice={location.state?.notice}
        initialView={location.state?.openForgot ? 'forgot' : 'signin'}
        onSignIn={({ keepLoggedIn } = {}) => {
          ;(keepLoggedIn ? localStorage : sessionStorage).setItem(AUTH_KEY, '1')
          setAuthed(true)
          setView('roles')
          navigate('/', { replace: true, state: null })
        }}
      />
    )
  }

  const addRole = (interviewQuestions = null) => {
    const cfg = draft ?? { title: 'New role', define_by: 'recruiter', approve_by: 'hiring_manager' }
    setRoles((prev) => [{ ...makeRole(`role-${prev.length + 1}`, cfg), interviewQuestions }, ...prev])
    setJobsEverSubmitted((prev) => prev + 1)
  }

  // Discard removes a role that never reached real candidates. Close stops
  // future matching but never touches the candidates already found.
  const discardRole = (role) => setRoles((prev) => prev.filter((r) => r.id !== role.id))
  const closeRole = (role, feedback) =>
    setRoles((prev) =>
      prev.map((r) =>
        r.id === role.id ? { ...r, state: 'closed', updated: 'Closed just now', closeFeedback: feedback || undefined } : r,
      ),
    )
  const reopenRole = (role) =>
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, state: 'matching', updated: 'Reopened just now' } : r)),
    )
  const discardDraft = () => {
    setDraft(null)
    setDraftProbes([])
    setDraftQuestions(null)
    setView('roles')
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

  // Define and Review carry their own app shell (sidebar + top bar), so they
  // render full-screen rather than inside the sidebar layout below.
  if (view === 'define') {
    return (
      <DefineRoleScreen
        roleTitle={draft?.title ?? 'New role'}
        onBack={() => setView('create')}
        onAskManager={() => setView('invite-manager')}
        onDiscard={discardDraft}
        // Carry every probe currently in state forward — Review must show
        // exactly what the conversation produced, not a blank card.
        onComplete={(probes) => {
          setDraftProbes(probes ?? [])
          setView('review')
        }}
      />
    )
  }
  if (view === 'review') {
    return (
      <ReviewRoleScreen
        roleTitle={draft?.title ?? 'New role'}
        openings={draft?.openings ?? 1}
        probes={draftProbes}
        submitLabel="Next: interview questions"
        onBack={() => setView('define')}
        onDiscard={discardDraft}
        onSubmit={() => setView('questions')}
      />
    )
  }
  if (view === 'questions') {
    return (
      <InterviewQuestionsScreen
        roleTitle={draft?.title ?? 'New role'}
        probes={draftProbes}
        questions={draftQuestions ?? undefined}
        // Keep edits when stepping back to the card and returning.
        onBack={(qs) => {
          if (qs) setDraftQuestions(qs)
          setView('review')
        }}
        onDiscard={discardDraft}
        onSubmit={(qs) => {
          addRole(qs)
          setDraft(null)
          setDraftProbes([])
          setDraftQuestions(null)
          setRunMatch(true) // first submit of this role: run the matching animation
          setView('candidates')
        }}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      <Sidebar
        active={activeNav}
        counts={{ Roles: roles.length, Candidates: candidates.length }}
        onNavigate={(item) => {
          if (item === 'Roles') setView('roles')
          else {
            setOpenRole(null) // the candidate view defaults to the Product Engineer role
            setRunMatch(false) // returning to candidates: straight to the tabs, no re-animation
            setView('candidates')
          }
        }}
        onNewRole={() => setView('create')}
        newRoleDisabled={jobLimitReached}
        workspace={workspace}
        plan={plan}
        onTogglePlan={() => setPlan((p) => (p === 'free' ? 'paid' : 'free'))}
        onOpenProfile={() => setView('profile')}
      />

      {view === 'profile' && <ProfileScreen onBack={() => setView('roles')} />}

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
          jobLimitReached={jobLimitReached}
          onUpgrade={goUpgrade}
          onOpenRole={(role) => {
            // Opening an existing role goes straight to the candidate tabs; the
            // matching animation only runs the one time a role is submitted.
            setOpenRole(role)
            setRunMatch(false)
            setView('candidates')
          }}
          onDiscardRole={discardRole}
          onCloseRole={closeRole}
          defineNotice={{
            // A hiring manager finished defining a role via magic link.
            manager: 'Tom',
            roleTitle: 'Engineering Manager',
            onReview: () => {
              const em = roles.find((r) => r.id === 'r-em')
              setOpenRole(em ?? null)
              setRunMatch(true) // a fresh submit: run the matching animation once
              setView('candidates')
            },
          }}
          autoCloseNotice={{
            // Frontend Lead closed itself 15 days after submission, no action taken.
            roleTitle: 'Frontend Lead',
            onReopen: () => reopenRole({ id: 'r-fl' }),
          }}
        />
      )}

      {view === 'create' && (
        <CreateRoleScreen
          onCancel={() => setView('roles')}
          onContinue={(cfg) => {
            // The title is picked from the role list, so it always resolves to a
            // family. Asking a manager to define is an action on the define screen.
            setDraft(cfg)
            setView('define')
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
              roleTitle={draft?.title ?? inviteRole.title}
              preset={null}
              onCancel={() => setView('define')}
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

      {view === 'candidates' &&
        (() => {
          // Re-resolve from the live roles array (not the stale openRole
          // snapshot) so a Close/Discard while inside this screen is reflected.
          const pipelineRoleId = openRole?.id ?? 'r-spe'
          const pipelineRole = roles.find((r) => r.id === pipelineRoleId)
          const canClose = pipelineRole?.state === 'matching' || pipelineRole?.state === 'ready'
          return (
            <CandidatesScreen
              key={`${pipelineRole?.id}-${runMatch ? 'match' : 'list'}`}
              roleTitle={pipelineRole?.title ?? 'Product Engineer'}
              roleId={pipelineRole?.id ?? 'r-spe'}
              requirements={pipelineRole?.requirements}
              runMatch={runMatch}
              canClose={canClose}
              onCloseRole={(feedback) => pipelineRole && closeRole(pipelineRole, feedback)}
              plan={plan}
              creditsUsed={creditsUsedForPlan}
              creditLimit={creditLimit}
              onConsumeCredits={consumeCredits}
              onRefundCredit={refundCredit}
              onUpgrade={goUpgrade}
            />
          )
        })()}

      {view === 'upgrade' && (
        <UpgradeScreen onBack={() => setView(activeNav === 'Candidates' ? 'candidates' : 'roles')} />
      )}


      {view === 'manager-decision' && (
        <ManagerDecisionScreen
          manager="Anjali Rao"
          roleTitle="Product Engineer"
          candidates={reviewed}
          approvedIds={approvedIds}
          interviews={interviews}
        />
      )}

      {view === 'invite' && (
        <InviteScreen roleTitle="Product Engineer" onBack={() => setView('candidates')} />
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

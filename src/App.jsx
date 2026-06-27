import { useState } from 'react'
import { Sidebar } from './components'
import { workspace } from './data/candidates.js'
import LoginScreen from './screens/LoginScreen.jsx'
import RolesScreen from './screens/RolesScreen.jsx'
import CreateRoleScreen from './screens/CreateRoleScreen.jsx'
import DefineRoleScreen from './screens/DefineRoleScreen.jsx'
import ReviewRoleScreen from './screens/ReviewRoleScreen.jsx'
import CandidatesScreen from './screens/CandidatesScreen.jsx'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [view, setView] = useState('roles') // roles | create | define | candidates
  const [roles, setRoles] = useState([])
  const [draft, setDraft] = useState(null) // { title, openings, method } from Create Role

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
    const role = {
      id: `role-${roles.length + 1}`,
      title: cfg.title,
      location: 'Remote · Europe',
      type: 'Full-time',
      status: 'Open',
      candidates: 6,
      updated: 'Updated just now',
    }
    setRoles((prev) => [role, ...prev])
  }

  const activeNav = view === 'candidates' ? 'Candidates' : 'Roles'

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

      {view === 'candidates' && <CandidatesScreen />}
    </div>
  )
}

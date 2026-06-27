import { useState } from 'react'
import { Sidebar } from './components'
import { workspace } from './data/candidates.js'
import { makeFirstRole, makeDraftRole } from './data/roles.js'
import LoginScreen from './screens/LoginScreen.jsx'
import RolesScreen from './screens/RolesScreen.jsx'
import CandidatesScreen from './screens/CandidatesScreen.jsx'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [nav, setNav] = useState('Roles')
  const [roles, setRoles] = useState([])

  if (!authed) {
    return (
      <LoginScreen
        onSignIn={() => {
          setAuthed(true)
          setNav('Roles')
        }}
      />
    )
  }

  const createRole = () => {
    setRoles((prev) => (prev.length === 0 ? [makeFirstRole()] : [makeDraftRole(prev.length), ...prev]))
    setNav('Roles')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      <Sidebar active={nav} onNavigate={setNav} onNewRole={createRole} workspace={workspace} />

      {nav === 'Roles' ? (
        <RolesScreen roles={roles} onCreateRole={createRole} onOpenRole={() => setNav('Candidates')} />
      ) : (
        <CandidatesScreen />
      )}
    </div>
  )
}

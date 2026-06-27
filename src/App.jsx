import { useState } from 'react'
import {
  Sidebar,
  StaggerList,
  CandidateRow,
  CandidateDetail,
} from './components'
import { candidates, workspace } from './data/candidates.js'

/* Calm empty state for the detail pane on wide screens before a pick. */
function DetailEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-20 text-center">
      <p className="max-w-xs text-sm leading-relaxed text-secondary">
        Select a candidate to open their review.
      </p>
    </div>
  )
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Candidates')
  const [selectedId, setSelectedId] = useState(candidates[0].id)

  const selected = candidates.find((c) => c.id === selectedId) ?? null

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      <Sidebar active={activeNav} onNavigate={setActiveNav} workspace={workspace} />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile-only header (sidebar is hidden below lg) */}
        <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
          <span className="font-medium tracking-tight text-ink">
            Azisly <span className="text-secondary">Recruit</span>
          </span>
        </header>

        {/* Page header */}
        <div className="shrink-0 border-b border-hairline px-6 pb-5 pt-7 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-secondary">
            Pipeline · Senior Product Engineer
          </p>
          <h1 className="mt-1.5 text-2xl text-ink">Candidates</h1>
        </div>

        {/* Two-pane master / detail */}
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(320px,380px)_1fr]">
          {/* Left: scrollable list */}
          <div
            className={`min-h-0 flex-col overflow-y-auto border-r border-hairline ${
              selected ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <StaggerList className="flex flex-col gap-1 p-3" step={60}>
              {candidates.map((c) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  selected={c.id === selectedId}
                  onClick={() => setSelectedId(c.id)}
                />
              ))}
            </StaggerList>
          </div>

          {/* Right: detail */}
          <div
            className={`min-h-0 overflow-y-auto ${selected ? 'block' : 'hidden lg:block'}`}
          >
            {selected ? (
              <CandidateDetail candidate={selected} onBack={() => setSelectedId(null)} />
            ) : (
              <DetailEmpty />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

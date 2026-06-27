import { useState } from 'react'
import {
  Sidebar,
  StaggerList,
  CandidateRow,
  CandidateDetail,
  Chip,
} from './components'
import { candidates, workspace } from './data/candidates.js'

const FILTERS = [
  { key: 'all', label: 'All candidates' },
  { key: 'strong', label: 'Strong' },
  { key: 'look-closer', label: 'Look closer' },
]

export default function App() {
  const [activeNav, setActiveNav] = useState('Candidates')
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const selected = candidates.find((c) => c.id === selectedId) ?? null
  const visible = candidates.filter((c) => filter === 'all' || c.verdict === filter)

  // When a detail is open the list compacts to a narrow column; otherwise it's
  // a comfortable, full-width list.
  const listColumn = selected
    ? 'hidden border-r border-hairline lg:flex lg:w-[340px] lg:shrink-0'
    : 'flex w-full'

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
        <div className="shrink-0 border-b border-hairline px-8 pb-8 pt-10 lg:px-12">
          <p className="text-sm text-secondary">Pipeline · Senior Product Engineer</p>
          <h1 className="mt-2 text-2xl text-ink">Candidates</h1>
        </div>

        {/* Master list  +  detail overlay */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {/* Left: the list — full-width by default, compacting when a detail opens */}
          <div
            className={`flex min-h-0 flex-col overflow-y-auto transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${listColumn}`}
          >
            {!selected && (
              <div className="mx-auto flex w-full max-w-2xl flex-wrap gap-2 px-8 pb-8 pt-6 lg:px-12">
                {FILTERS.map((f) => (
                  <Chip
                    key={f.key}
                    selected={filter === f.key}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </Chip>
                ))}
              </div>
            )}

            <StaggerList
              className={
                selected
                  ? 'flex flex-col gap-1 p-3'
                  : 'mx-auto flex w-full max-w-2xl flex-col gap-4 px-8 pb-16 lg:px-12'
              }
              step={selected ? 40 : 70}
            >
              {visible.map((c) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  variant={selected ? 'compact' : 'rich'}
                  selected={c.id === selectedId}
                  onClick={() => setSelectedId(c.id)}
                />
              ))}
            </StaggerList>
          </div>

          {/* Right: detail overlay — slides in over the list (full width on
              narrow screens, side-by-side beside the compact list on wide). */}
          {selected && (
            <div className="absolute inset-0 z-10 animate-slide-in-right overflow-y-auto bg-background lg:static lg:flex-1">
              <CandidateDetail candidate={selected} onBack={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

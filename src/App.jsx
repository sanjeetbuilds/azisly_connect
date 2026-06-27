import { useMemo, useState } from 'react'
import {
  Sidebar,
  SearchInput,
  Dropdown,
  ViewToggle,
  CandidateTable,
  CandidateCard,
  CandidateDetail,
} from './components'
import { candidates, workspace, STAGES } from './data/candidates.js'

function sortCandidates(list, { key, dir }) {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0
    if (key === 'name') cmp = a.name.localeCompare(b.name)
    else if (key === 'score') cmp = a.score - b.score
    else if (key === 'applied') cmp = a.appliedSort - b.appliedSort
    return dir === 'asc' ? cmp : -cmp
  })
  return sorted
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Candidates')
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('all')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [view, setView] = useState('list')
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' })
  const [selectedId, setSelectedId] = useState(null)

  const stageOptions = [
    { value: 'all', label: 'All stages' },
    ...STAGES.map((s) => ({ value: s, label: s })),
  ]
  const roleOptions = [
    { value: 'all', label: 'All roles' },
    ...[...new Set(candidates.map((c) => c.role))].map((r) => ({ value: r, label: r })),
  ]
  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'strong', label: 'Strong' },
    { value: 'look-closer', label: 'Look closer' },
  ]

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = candidates.filter((c) => {
      if (stage !== 'all' && c.stage !== stage) return false
      if (role !== 'all' && c.role !== role) return false
      if (status !== 'all' && c.verdict !== status) return false
      if (q) {
        const hay = [c.name, c.role, c.location, ...c.skills].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return sortCandidates(filtered, sort)
  }, [search, stage, role, status, sort])

  const selected = candidates.find((c) => c.id === selectedId) ?? null

  const handleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' },
    )

  const closeDetail = () => setSelectedId(null)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      <Sidebar active={activeNav} onNavigate={setActiveNav} workspace={workspace} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile-only header */}
        <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
          <span className="font-medium tracking-tight text-ink">
            Azisly <span className="text-secondary">Recruit</span>
          </span>
        </header>

        {/* Page header */}
        <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
          <p className="text-sm text-secondary">Pipeline · Senior Product Engineer</p>
          <h1 className="mt-1.5 text-2xl text-ink">Candidates</h1>
        </div>

        {/* Content: a floating surface holding the toolbar + table/grid */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
              <span className="text-sm text-secondary">
                <span className="font-medium text-ink">{visible.length}</span> candidates
              </span>
              <div className="w-full sm:w-60">
                <SearchInput value={search} onChange={setSearch} />
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Dropdown label="Stage" value={stage} options={stageOptions} onChange={setStage} />
                <Dropdown label="Role" value={role} options={roleOptions} onChange={setRole} />
                <Dropdown label="Status" value={status} options={statusOptions} onChange={setStatus} />
                <ViewToggle value={view} onChange={setView} />
              </div>
            </div>

            {/* Results */}
            {visible.length === 0 ? (
              <div className="px-6 py-20 text-center text-sm text-secondary">
                No candidates match these filters.
              </div>
            ) : view === 'list' ? (
              <div className="overflow-x-auto">
                <CandidateTable
                  candidates={visible}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  sort={sort}
                  onSort={handleSort}
                />
              </div>
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    selected={c.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating detail drawer */}
        {selected && (
          <>
            <button
              type="button"
              aria-label="Close detail"
              onClick={closeDetail}
              className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
            />
            <div className="absolute inset-y-0 right-0 z-30 flex w-full max-w-xl animate-slide-in-right flex-col overflow-y-auto border-l border-hairline bg-surface shadow-overlay">
              <CandidateDetail candidate={selected} onBack={closeDetail} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

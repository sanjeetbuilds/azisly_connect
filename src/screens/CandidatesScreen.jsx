import { useMemo, useState } from 'react'
import {
  Button,
  SearchInput,
  Dropdown,
  ViewToggle,
  CandidateTable,
  CandidateCard,
  CandidateDetail,
} from '../components'
import ShareWithManagerModal from '../components/ShareWithManagerModal.jsx'
import { CheckIcon } from '../components/icons.jsx'
import { candidates, STAGES } from '../data/candidates.js'

function sortCandidates(list, { key, dir }) {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0
    if (key === 'name') cmp = a.name.localeCompare(b.name)
    else if (key === 'score') cmp = (a.score ?? -1) - (b.score ?? -1)
    else if (key === 'applied') cmp = a.appliedSort - b.appliedSort
    return dir === 'asc' ? cmp : -cmp
  })
  return sorted
}

/**
 * CandidatesScreen — the dense candidate review for a role: toolbar furniture,
 * a sortable data table or grid, and a floating detail drawer.
 */
export default function CandidatesScreen({ onInvite, onDecide, managerResponse }) {
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('all')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [view, setView] = useState('list')
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' })
  const [selectedId, setSelectedId] = useState(null)
  const [selectMode, setSelectMode] = useState(false)
  const [picked, setPicked] = useState(() => new Set())
  const [shareOpen, setShareOpen] = useState(false)

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

  const toggle = (id) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const toggleAll = () =>
    setPicked((prev) => {
      const allIn = visible.length > 0 && visible.every((c) => prev.has(c.id))
      return allIn ? new Set() : new Set(visible.map((c) => c.id))
    })
  const enterSelect = () => {
    setSelectMode(true)
    setView('list')
    setSelectedId(null)
  }
  const exitSelect = () => {
    setSelectMode(false)
    setPicked(new Set())
  }
  const pickedCandidates = candidates.filter((c) => picked.has(c.id))

  return (
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
        {/* The hiring manager has responded — recruiter's update */}
        {managerResponse && (
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <span className="font-medium">{managerResponse.manager}</span> responded to your{' '}
                {managerResponse.roleTitle} shortlist
              </p>
              <p className="text-[13px] text-secondary">
                {managerResponse.approvedCount} taken forward · just now
              </p>
            </div>
            <Button onClick={managerResponse.onView}>See the picks</Button>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
          {/* Toolbar — normal, or a selection bar in select mode */}
          {selectMode ? (
            <div className="flex flex-wrap items-center gap-3 border-b border-hairline bg-accent/[0.03] px-5 py-3">
              <span className="text-sm text-secondary">
                <span className="font-medium text-ink">{picked.size}</span> selected
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-[13px] text-accent transition-colors hover:text-accent/80"
              >
                {visible.length > 0 && visible.every((c) => picked.has(c.id)) ? 'Clear all' : 'Select all'}
              </button>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Button variant="secondary" onClick={exitSelect}>
                  Cancel
                </Button>
                <Button disabled={picked.size === 0} onClick={() => setShareOpen(true)}>
                  Send to hiring manager
                </Button>
              </div>
            </div>
          ) : (
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
                {onInvite && (
                  <Button variant="secondary" onClick={onInvite}>
                    Invite to interview
                  </Button>
                )}
                <Button onClick={enterSelect}>Share with hiring manager</Button>
              </div>
            </div>
          )}

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
                selectable={selectMode}
                picked={picked}
                onToggle={toggle}
                onToggleAll={toggleAll}
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
            <CandidateDetail candidate={selected} onBack={closeDetail} onDecide={onDecide} />
          </div>
        </>
      )}

      {/* Share with hiring manager: confirm → review link */}
      {shareOpen && (
        <ShareWithManagerModal
          candidates={pickedCandidates}
          roleTitle="Senior Product Engineer"
          onClose={() => {
            setShareOpen(false)
            exitSelect()
          }}
        />
      )}
    </div>
  )
}

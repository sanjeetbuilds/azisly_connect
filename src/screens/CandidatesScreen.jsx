import { useMemo, useState } from 'react'
import {
  Button,
  CandidateTable,
  CandidateCard,
  CandidateDetail,
  ApprovedView,
  ViewToggle,
} from '../components'
import ShareWithManagerModal from '../components/ShareWithManagerModal.jsx'
import { CheckIcon, XIcon, SearchIcon, ClockIcon } from '../components/icons.jsx'
import { candidates, isReadyToReview, roleTotals } from '../data/candidates.js'
import { interviews } from '../data/interviews.js'

// Stage tabs filter the list. "Approved" opens the dedicated approved view.
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'to-interview', label: 'To interview', stages: ['Sourced'] },
  { key: 'in-progress', label: 'In progress', stages: ['Invited', 'Interviewing'] },
  { key: 'ready', label: 'Ready to review', stages: ['Ready to review', 'Needs human'] },
  { key: 'with-hm', label: 'With hiring manager', stages: ['Shared'] },
  { key: 'approved', label: 'Approved', stages: ['Taken forward'] },
]

// Only scored, not-yet-decided candidates can be ticked.
function eligibility(c) {
  if (isReadyToReview(c)) return { ok: true }
  if (c.stage === 'Shared') return { ok: false, reason: 'With the hiring manager' }
  if (c.stage === 'Taken forward' || c.stage === 'Passed')
    return { ok: false, reason: 'Already decided' }
  return { ok: false, reason: 'Not scored yet' }
}

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
 * CandidatesScreen — the recruiter's view while a shortlist is with the hiring
 * manager and after the manager responds. Candidates sent to the manager read
 * "With hiring manager"; once the manager responds, the picks are highlighted,
 * their contacts unlock, and the dedicated "Approved" tab surfaces them.
 */
export default function CandidatesScreen({ approveBy = 'hiring_manager', managerResponse }) {
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [tab, setTab] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' })
  const [selectedId, setSelectedId] = useState(null)
  const [picked, setPicked] = useState(() => new Set())
  const [skipped, setSkipped] = useState(() => new Set())
  const [lastTick, setLastTick] = useState(null)
  const [opened, setOpened] = useState(() => new Set())
  const [shareOpen, setShareOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(true)
  const [movedCount, setMovedCount] = useState(0)

  const managerFirst = (managerResponse?.manager ?? 'the hiring manager').split(' ')[0]

  const pendingCount = candidates.filter((c) => c.stage === 'Shared').length
  const approvedList = candidates.filter((c) => c.stage === 'Taken forward')

  const isFresh = (c) => Boolean(c.isNew) && !opened.has(c.id)

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const active = TABS.find((t) => t.key === tab) ?? TABS[0]
    const filtered = candidates.filter((c) => {
      if (active?.stages && !active.stages.includes(c.stage)) return false
      if (q) {
        const hay = [c.name, c.role, c.location, ...c.skills].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    const sorted = sortCandidates(filtered, sort)
    return [...sorted].sort((a, b) => (isFresh(b) ? 1 : 0) - (isFresh(a) ? 1 : 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tab, sort, opened])

  const selected = candidates.find((c) => c.id === selectedId) ?? null
  const pickedEligible = candidates.filter((c) => picked.has(c.id) && eligibility(c).ok)
  const n = pickedEligible.length

  const moveForward = () => {
    if (!n) return
    setMovedCount(n)
    clearPicked()
  }
  const primary =
    approveBy === 'recruiter_alone'
      ? {
          label: n > 0 ? `Move ${n} forward` : 'Move forward',
          helper: 'Tick scored candidates to move them forward',
          run: moveForward,
        }
      : {
          label: n > 0 ? `Send ${n} to hiring manager` : 'Send to hiring manager',
          helper: 'Tick scored candidates to send to the hiring manager',
          run: () => setShareOpen(true),
        }

  const handleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' },
    )

  const switchTab = (key) => {
    setTab(key)
    setPicked(new Set())
    setSkipped(new Set())
    setLastTick(null)
    setSelectedId(null)
  }

  const openDetail = (id) => {
    setSelectedId(id)
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }

  const tick = (id, index, shiftKey) => {
    const c = candidates.find((x) => x.id === id)
    if (!c || !eligibility(c).ok) return
    if (shiftKey && lastTick != null) {
      const [a, b] = lastTick <= index ? [lastTick, index] : [index, lastTick]
      setPicked((prev) => {
        const next = new Set(prev)
        for (let i = a; i <= b; i += 1) {
          const cc = visible[i]
          if (cc && eligibility(cc).ok) next.add(cc.id)
        }
        return next
      })
      setSkipped((prev) => {
        const next = new Set(prev)
        for (let i = a; i <= b; i += 1) {
          const cc = visible[i]
          if (cc) next.delete(cc.id)
        }
        return next
      })
    } else {
      setPicked((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      setSkipped((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
    setLastTick(index)
  }
  const cross = (id) => {
    const c = candidates.find((x) => x.id === id)
    if (!c || !eligibility(c).ok) return
    setSkipped((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setPicked((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }
  const tickById = (id) => tick(id, visible.findIndex((c) => c.id === id), false)

  const toggleAll = () =>
    setPicked((prev) => {
      const eligibleVisible = visible.filter((c) => eligibility(c).ok)
      const allIn = eligibleVisible.length > 0 && eligibleVisible.every((c) => prev.has(c.id))
      const next = new Set(prev)
      eligibleVisible.forEach((c) => (allIn ? next.delete(c.id) : next.add(c.id)))
      return next
    })
  const clearPicked = () => {
    setPicked(new Set())
    setSkipped(new Set())
  }

  const showApproved = tab === 'approved'

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header */}
      <div className="shrink-0 px-6 pb-4 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Pipeline · Senior Product Engineer</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-2xl text-ink">Candidates</h1>
          <span className="inline-flex items-center rounded-full bg-info/10 px-2 py-0.5 font-mono text-xs font-medium text-info tabular-nums">
            {roleTotals.total}
          </span>
          {roleTotals.readyToReview > 0 && (
            <span className="text-[13px] font-medium text-info">
              {roleTotals.readyToReview} ready to review
            </span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 lg:px-8">
        {/* The manager has responded — a dismissible notification */}
        {managerResponse && noticeOpen && (
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <span className="font-medium">{managerFirst}</span> took{' '}
                {managerResponse.approvedCount} candidate
                {managerResponse.approvedCount === 1 ? '' : 's'} forward
              </p>
              <p className="text-[13px] text-secondary">just now</p>
            </div>
            <Button onClick={() => switchTab('approved')}>See the picks</Button>
            <button
              type="button"
              onClick={() => setNoticeOpen(false)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1.5 text-secondary transition-colors hover:bg-strong/10 hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Recruiter-alone confirmation */}
        {movedCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-5 w-5" />
            </span>
            <p className="min-w-0 flex-1 text-sm text-ink">
              <span className="font-medium">{movedCount}</span> candidate{movedCount === 1 ? '' : 's'}{' '}
              moved forward to offline rounds
            </p>
            <button
              type="button"
              onClick={() => setMovedCount(0)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1.5 text-secondary transition-colors hover:bg-strong/10 hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Pending-with-manager summary */}
        {pendingCount > 0 && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-hairline bg-background px-3 py-1.5 text-[13px] text-secondary">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>
              <span className="font-medium text-ink">{pendingCount}</span> with {managerFirst},
              awaiting picks
            </span>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
          {/* Toolbar — tabs left, restrained search and the view toggle right */}
          <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => switchTab(t.key)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    tab === t.key ? 'bg-ink text-surface' : 'text-secondary hover:bg-background hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {searchOpen ? (
                <div className="relative flex items-center">
                  <SearchIcon className="pointer-events-none absolute left-2.5 h-4 w-4 text-secondary" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearch('')
                        setSearchOpen(false)
                      }
                    }}
                    placeholder="Search"
                    className="w-52 rounded-lg border border-hairline bg-surface py-1.5 pl-8 pr-8 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      setSearchOpen(false)
                    }}
                    aria-label="Close search"
                    className="absolute right-1.5 flex h-5 w-5 items-center justify-center rounded text-secondary transition-colors hover:text-ink"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
              )}
              {!showApproved && <ViewToggle value={viewMode} onChange={setViewMode} />}
            </div>
          </div>

          {/* Action bar — one top action, hidden on the approved view */}
          {!showApproved && (
            <div className="flex flex-wrap items-center gap-3 border-b border-hairline bg-background/40 px-4 py-2.5">
              {n > 0 ? (
                <span className="text-[13px] text-secondary">
                  <span className="font-medium text-ink">{n}</span> selected ·{' '}
                  <button
                    type="button"
                    onClick={clearPicked}
                    className="font-medium text-info transition-colors hover:underline"
                  >
                    Clear
                  </button>
                </span>
              ) : (
                <span className="text-[13px] text-secondary">{primary.helper}</span>
              )}
              <div className="ml-auto">
                <Button disabled={n === 0} onClick={primary.run}>
                  {primary.label}
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          {showApproved ? (
            <ApprovedView candidates={approvedList} onOpen={openDetail} />
          ) : visible.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-secondary">
              No candidates in this view.
            </div>
          ) : viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <CandidateTable
                candidates={visible}
                selectedId={selectedId}
                onSelect={openDetail}
                sort={sort}
                onSort={handleSort}
                picked={picked}
                skipped={skipped}
                onTick={tick}
                onCross={cross}
                onToggleAll={toggleAll}
                eligibility={eligibility}
                isNew={isFresh}
              />
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((c) => {
                const elig = eligibility(c)
                return (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    selected={c.id === selectedId}
                    onSelect={openDetail}
                    picked={picked.has(c.id)}
                    skipped={skipped.has(c.id)}
                    disabled={!elig.ok}
                    reason={elig.reason}
                    onTick={() => tickById(c.id)}
                    onCross={() => cross(c.id)}
                  />
                )
              })}
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
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
          />
          <div
            key={selected.id}
            className="absolute inset-y-0 right-0 z-30 flex w-full max-w-xl animate-slide-in-right flex-col overflow-y-auto border-l border-hairline bg-surface shadow-overlay"
          >
            <CandidateDetail
              candidate={selected}
              onBack={() => setSelectedId(null)}
              interview={interviews[selected.id]}
              judge={{
                eligible: eligibility(selected).ok,
                picked: picked.has(selected.id),
                skipped: skipped.has(selected.id),
                onTick: () => tickById(selected.id),
                onCross: () => cross(selected.id),
              }}
            />
          </div>
        </>
      )}

      {/* Send to hiring manager: only ever the eligible selection */}
      {shareOpen && (
        <ShareWithManagerModal
          candidates={pickedEligible}
          roleTitle="Senior Product Engineer"
          onClose={() => {
            setShareOpen(false)
            clearPicked()
          }}
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Button, Tag, Avatar } from '../components'
import { ChevronRightIcon } from '../components/icons.jsx'
import { ROLE_STATUS } from '../data/roles.js'

function EmptyState({ onCreateRole }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6 pb-16">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-surface text-secondary shadow-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
            <rect x="3.5" y="7.5" width="17" height="11.5" rx="2" />
            <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg text-ink">No roles yet</h2>
          <p className="text-sm leading-relaxed text-secondary">
            Create your first role to start sourcing and judging candidates.
          </p>
        </div>
        <Button onClick={onCreateRole}>Create your first role</Button>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="h-3.5 w-40 rounded bg-hairline" />
        <div className="mt-2 h-3 w-28 rounded bg-hairline/70" />
      </div>
      <div className="h-5 w-24 rounded-full bg-hairline" />
      <div className="h-3.5 w-28 rounded bg-hairline" />
    </div>
  )
}

// Stable, distinct faces per role, derived from its id. Up to four shown.
function roleFaces(role) {
  const shown = Math.min(4, role.totalCandidates)
  let h = 0
  for (let i = 0; i < role.id.length; i += 1) h = (h * 31 + role.id.charCodeAt(i)) >>> 0
  return Array.from({ length: shown }, (_, i) => `https://i.pravatar.cc/96?img=${((h + i * 13) % 70) + 1}`)
}

/* A small overlapping stack of a role's candidate faces, plus a "+N" chip. */
function AvatarStack({ role }) {
  if (role.totalCandidates === 0) return null
  const faces = roleFaces(role)
  const extra = role.totalCandidates - faces.length
  return (
    <div className="flex items-center -space-x-2">
      {faces.map((src, i) => (
        <Avatar key={i} src={src} name="Candidate" size={26} className="ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className="flex h-[26px] items-center justify-center rounded-full border border-hairline bg-background px-1.5 text-[11px] font-medium text-secondary ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  )
}

function RoleRow({ role, onClick }) {
  const ready = role.candidatesReady > 0
  const defining = role.status === 'defining'
  const statusLabel = role.awaitingManager
    ? 'Awaiting hiring manager'
    : (ROLE_STATUS[role.status]?.label ?? 'Defining')

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-hairline px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-background"
    >
      {/* Title */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-ink">{role.title}</div>
        <div className="truncate text-[13px] text-secondary">
          {role.location} · {role.type}
        </div>
      </div>

      {/* Middle — overlapping candidate faces fill the empty space */}
      <div className="hidden flex-1 justify-center sm:flex">
        <AvatarStack role={role} />
      </div>

      {/* Status, said once: lead with the count, neutral grey tag only when it adds info */}
      <div className="flex w-[190px] shrink-0 flex-col items-end gap-1.5">
        {defining && <Tag color="gray">{statusLabel}</Tag>}
        {ready ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-info">
            <span className="h-1.5 w-1.5 rounded-full bg-info" />
            {role.candidatesReady} ready to review
          </span>
        ) : (
          <span className="text-[13px] text-secondary">
            {role.totalCandidates > 0 ? `${role.totalCandidates} sourced` : 'Not sourcing yet'}
          </span>
        )}
      </div>

      <ChevronRightIcon className="h-4 w-4 shrink-0 text-secondary" />
    </button>
  )
}

/**
 * RolesScreen — the populated workspace: a clean list of the recruiter's roles.
 * The count lives in the title; each row says its status once (lead with the
 * count) and fills the middle with a stack of its candidate faces.
 */
export default function RolesScreen({ roles, onCreateRole, onOpenRole }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850)
    return () => clearTimeout(t)
  }, [])

  const empty = !loading && roles.length === 0
  const readyCount = roles.filter((r) => r.candidatesReady > 0).length

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header — count and ready signal live in the title */}
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Acme · Workspace</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-2xl text-ink">Roles</h1>
          {!loading && !empty && (
            <>
              <span className="inline-flex items-center rounded-full bg-info/10 px-2 py-0.5 font-mono text-xs font-medium text-info tabular-nums">
                {roles.length}
              </span>
              {readyCount > 0 && (
                <span className="text-[13px] font-medium text-info">
                  {readyCount} with candidates ready
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {empty ? (
        <EmptyState onCreateRole={onCreateRole} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
            {loading ? (
              <div className="animate-pulse divide-y divide-hairline">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : (
              roles.map((r) => <RoleRow key={r.id} role={r} onClick={() => onOpenRole(r)} />)
            )}
          </div>
        </div>
      )}
    </div>
  )
}

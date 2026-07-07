import { useEffect, useState } from 'react'
import { Button, Tag, Avatar, PageHeader } from '../components'
import { ChevronRightIcon, CheckIcon, XIcon } from '../components/icons.jsx'
import { ROLE_STATES } from '../data/roles.js'

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

// Distinct faces per role: each role draws from its own band of photos, so no
// two rows share the same candidates.
function roleFaces(role, index) {
  const shown = Math.min(4, role.totalCandidates)
  const base = index * 12
  return Array.from({ length: shown }, (_, i) => `https://i.pravatar.cc/96?img=${((base + i * 3) % 70) + 1}`)
}

/* A small overlapping stack of a role's candidate faces, plus a "+N" chip. */
function AvatarStack({ role, index }) {
  if (role.totalCandidates === 0) return null
  const faces = roleFaces(role, index)
  const extra = role.totalCandidates - faces.length
  return (
    <div className="flex items-center -space-x-2">
      {faces.map((_, i) => (
        <Avatar key={i} seed={`${role.id}-${i}`} name="Candidate" size={26} className="ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className="flex h-[26px] items-center justify-center rounded-full border border-hairline bg-background px-1.5 text-[11px] font-medium text-secondary ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  )
}

/* One status per role, derived from its lifecycle state. Ready to review leads
   with the info-accent count; the other states read as plain grey. */
function RoleStatus({ role }) {
  if (role.state === 'ready') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {role.candidatesReady} ready to review
      </span>
    )
  }
  if (role.state === 'defined') {
    return (
      <span className="text-right text-[13px] text-secondary">
        Defined by {role.definedBy ?? 'the hiring manager'}, ready to submit
      </span>
    )
  }
  if (role.state === 'being_defined') {
    return (
      <Tag color="gray">
        {role.define_by === 'hiring_manager' ? 'Being defined by hiring manager' : 'Being defined by you'}
      </Tag>
    )
  }
  // created | matching | closed
  return <Tag color="gray">{role.state === 'matching' ? 'Matching' : ROLE_STATES[role.state]}</Tag>
}

function RoleRow({ role, index, onClick }) {
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
        <AvatarStack role={role} index={index} />
      </div>

      {/* One status per role, from its lifecycle state */}
      <div className="flex w-[210px] shrink-0 justify-end">
        <RoleStatus role={role} />
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
export default function RolesScreen({ roles, onCreateRole, onOpenRole, defineNotice }) {
  const [loading, setLoading] = useState(true)
  const [noticeOpen, setNoticeOpen] = useState(true)

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

      {/* Page header — bold title + live counts subtitle */}
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <PageHeader
          breadcrumb={['Workspace', 'Roles']}
          title="Roles"
          stats={
            !loading && !empty
              ? [
                  { n: roles.length, label: roles.length === 1 ? 'role' : 'roles' },
                  { n: readyCount, label: 'with candidates ready' },
                ]
              : undefined
          }
        />
      </div>

      {empty ? (
        <EmptyState onCreateRole={onCreateRole} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 lg:px-8">
          {/* A hiring manager finished a definition — a dismissible notification */}
          {defineNotice && noticeOpen && (
            <div className="mb-4 flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-surface px-5 py-3.5 shadow-card">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">
                  <span className="font-medium">{defineNotice.manager}</span> defined{' '}
                  {defineNotice.roleTitle}
                </p>
                <p className="text-[13px] text-secondary">Ready to submit for matching · just now</p>
              </div>
              {defineNotice.onReview && (
                <Button onClick={defineNotice.onReview}>Review and submit</Button>
              )}
              <button
                type="button"
                onClick={() => setNoticeOpen(false)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-lg p-1.5 text-secondary transition-colors hover:bg-background hover:text-ink"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
            {loading ? (
              <div className="animate-pulse divide-y divide-hairline">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : (
              roles.map((r, i) => (
                <RoleRow key={r.id} role={r} index={i} onClick={() => onOpenRole(r)} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

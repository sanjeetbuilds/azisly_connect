import { Button, Card, Tag } from '../components'

function RoleCard({ role, onClick }) {
  return (
    <Card
      as="button"
      onClick={onClick}
      className="flex flex-col gap-4 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] text-ink">{role.title}</h3>
          <p className="mt-0.5 truncate text-[13px] text-secondary">
            {role.location} · {role.type}
          </p>
        </div>
        <Tag color={role.status === 'Open' ? 'green' : 'gray'}>{role.status}</Tag>
      </div>
      <div className="flex items-center justify-between border-t border-hairline pt-3.5 text-[13px] text-secondary">
        <span>
          {role.candidates} candidate{role.candidates === 1 ? '' : 's'}
        </span>
        <span>{role.updated}</span>
      </div>
    </Card>
  )
}

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

/**
 * RolesScreen — the workspace home. Empty right after login ("No roles yet");
 * once roles exist, the same screen becomes the roles/jobs list.
 */
export default function RolesScreen({ roles, onCreateRole, onOpenRole }) {
  const empty = roles.length === 0

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 pb-5 pt-8 lg:px-8">
        <div>
          <p className="text-sm text-secondary">Acme · Workspace</p>
          <h1 className="mt-1.5 text-2xl text-ink">Roles</h1>
        </div>
        {!empty && <Button onClick={onCreateRole}>New role</Button>}
      </div>

      {/* Content */}
      {empty ? (
        <EmptyState onCreateRole={onCreateRole} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 lg:px-8">
          <p className="mb-4 text-sm text-secondary">
            <span className="font-medium text-ink">{roles.length}</span> role
            {roles.length === 1 ? '' : 's'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {roles.map((r) => (
              <RoleCard key={r.id} role={r} onClick={() => onOpenRole(r)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

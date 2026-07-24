import { useState } from 'react'
import { Button, Card, Input, PageHeader } from '../components'
import { ArrowLeftIcon, LockIcon } from '../components/icons.jsx'
import { RECRUITER_ACCOUNT } from '../data/recruiterAccount.js'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function Row({ label, value, locked, hint }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <div className="text-[13px] text-secondary">{label}</div>
        <div className="mt-0.5 truncate text-sm text-ink">{value}</div>
      </div>
      {locked ? (
        <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-muted">
          <LockIcon className="h-3.5 w-3.5" /> {hint ?? 'Locked'}
        </span>
      ) : null}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * ProfileScreen — Profile & company (C1). Shows name, company, website, email,
 * phone. Locked: company legal name and the verification document — both set
 * once during account verification and never editable here. Everything else
 * (name, phone, company website/email) is editable with standard validation.
 */
export default function ProfileScreen({ onBack }) {
  const [account, setAccount] = useState(() => ({
    ...RECRUITER_ACCOUNT,
    company: { ...RECRUITER_ACCOUNT.company },
  }))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [errors, setErrors] = useState({})

  const startEdit = () => {
    setDraft({
      name: account.name,
      phone: account.phone,
      website: account.company.website,
      email: account.company.email,
    })
    setErrors({})
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setDraft(null)
    setErrors({})
  }

  const save = () => {
    const next = {
      name: !draft.name.trim() ? 'Enter a name.' : '',
      phone: !draft.phone.trim() ? 'Enter a phone number.' : '',
      email: !draft.email.trim()
        ? 'Enter a company email.'
        : !isEmail(draft.email)
          ? 'Enter a valid email address.'
          : '',
      website: !draft.website.trim() ? 'Enter a company website.' : '',
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setAccount((prev) => ({
      ...prev,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      company: { ...prev.company, website: draft.website.trim(), email: draft.email.trim() },
    }))
    setEditing(false)
    setDraft(null)
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-secondary hover:text-ink"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back
      </button>

      <PageHeader
        title="Profile & company"
        subtitle="Your details and your company's information."
        actions={
          editing ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" onClick={save}>
                Save
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={startEdit}>
              Edit
            </Button>
          )
        }
      />

      <div className="mt-8 flex flex-col gap-6">
        <Card>
          <div className="border-b border-hairline px-5 py-3.5">
            <h2 className="text-sm font-semibold text-ink">Your details</h2>
          </div>
          {editing ? (
            <div className="flex flex-col gap-4 px-5 py-4">
              <Input
                label="Name"
                value={draft.name}
                error={errors.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
              <Input
                label="Phone"
                type="tel"
                value={draft.phone}
                error={errors.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              <Row label="Name" value={account.name} />
              <Row label="Phone" value={account.phone} />
            </div>
          )}
        </Card>

        <Card>
          <div className="border-b border-hairline px-5 py-3.5">
            <h2 className="text-sm font-semibold text-ink">Company</h2>
          </div>
          {editing ? (
            <div className="flex flex-col gap-4 px-5 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-secondary">Legal name</label>
                <div className="flex items-center gap-2 border-b border-hairline px-0.5 py-2 text-[15px] text-ink opacity-70">
                  {account.company.legalName}
                  <span className="inline-flex items-center gap-1 text-[12px] text-muted">
                    <LockIcon className="h-3.5 w-3.5" /> Locked
                  </span>
                </div>
              </div>
              <Input
                label="Website"
                value={draft.website}
                error={errors.website}
                onChange={(e) => setDraft((d) => ({ ...d, website: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={draft.email}
                error={errors.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              <Row label="Legal name" value={account.company.legalName} locked />
              <Row label="Website" value={account.company.website} />
              <Row label="Email" value={account.company.email} />
            </div>
          )}
        </Card>

        <Card>
          <div className="border-b border-hairline px-5 py-3.5">
            <h2 className="text-sm font-semibold text-ink">Verification document</h2>
          </div>
          <Row
            label={account.verificationDocument.name}
            value={`Uploaded ${formatDate(account.verificationDocument.uploadedAt)}`}
            locked
            hint="View only"
          />
        </Card>
      </div>
    </div>
  )
}

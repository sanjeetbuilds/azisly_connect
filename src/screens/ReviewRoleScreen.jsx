import { useState } from 'react'
import { Button, ConfirmDialog } from '../components'
import Shell from '../components/Shell.jsx'
import RoleCard from '../components/RoleCard.jsx'
import { CopyNeeded, AuthoringNeeded } from '../components/Spec.jsx'
import { CheckIcon } from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'
import { CONFIRM_COPY } from '../lib/roleStatus.js'

/*
 * ReviewRoleScreen — review the role inside the app shell and submit.
 *
 * The same single, self-ordering card as Define. "Submit role" is the top-bar
 * primary action, enabled as soon as the role family is set. Nothing is editable.
 */
function familySet(scorecard) {
  return Boolean(scorecard?.family && scorecard?.domainCompetency)
}

// The company this workspace recruits for. Matches the "Acme" used
// throughout the sidebar and the manager-facing flows.
const COMPANY = 'Acme'

export default function ReviewRoleScreen({
  roleTitle = '',
  openings = 1,
  scorecard: scorecardProp,
  probes = [],
  onBack,
  onSubmit,
  onDiscard,
}) {
  const scorecard = scorecardProp ?? roleScorecard({ title: roleTitle })
  const complete = familySet(scorecard)
  const [discardOpen, setDiscardOpen] = useState(false)

  return (
    <Shell
      active="Roles"
      breadcrumb="Roles · Review"
      title={roleTitle}
      onNavigate={() => onBack?.()}
      action={
        <div className="flex shrink-0 items-center gap-3">
          {/* Quiet next to Submit — Submit stays the loud action here. */}
          {onDiscard && (
            <button
              type="button"
              onClick={() => setDiscardOpen(true)}
              className="shrink-0 whitespace-nowrap text-[13px] font-medium text-secondary transition-colors hover:text-danger"
            >
              Discard
            </button>
          )}
          <Button
            onClick={onSubmit}
            disabled={!complete}
            variant="secondary"
            className="shrink-0 !border-ink !bg-ink !py-2 !text-[13px] !text-white"
          >
            {/* "Submit role" is verbatim PRD. */}
            Submit role
          </Button>
        </div>
      }
    >
      <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
        {/* This is a finished definition, not a form still being filled in. */}
        <div className="flex max-w-[720px] flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent-strong">
            <CheckIcon className="h-3 w-3" />
            Defined
          </span>
          <span className="text-[13px] text-secondary">{COMPANY}</span>
          <span className="text-muted">·</span>
          <span className="text-[13px] text-secondary">
            {openings} opening{openings === 1 ? '' : 's'}
          </span>
        </div>

        <RoleCard scorecard={scorecard} probes={probes} className="max-w-[720px]" />

        <div className="text-[13px]">
          {complete ? (
            <span className="text-secondary">
              You can submit now. Anything you add changes what we ask, not who qualifies.
            </span>
          ) : (
            <span className="flex flex-wrap items-center gap-2">
              <AuthoringNeeded note="no role family set — required before Submit" />
              <CopyNeeded note="submit-disabled reason sentence" />
            </span>
          )}
        </div>
      </div>

      {discardOpen && (
        <ConfirmDialog
          {...CONFIRM_COPY.discard}
          onCancel={() => setDiscardOpen(false)}
          onConfirm={() => {
            setDiscardOpen(false)
            onDiscard()
          }}
        />
      )}
    </Shell>
  )
}

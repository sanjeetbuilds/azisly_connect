import { Button } from '../components'
import Shell from '../components/Shell.jsx'
import RoleCard from '../components/RoleCard.jsx'
import { CopyNeeded, AuthoringNeeded } from '../components/Spec.jsx'
import { roleScorecard } from '../data/scorecard.js'

/*
 * ReviewRoleScreen — review the role inside the app shell and submit.
 *
 * The same single, self-ordering card as Define. "Submit role" is the top-bar
 * primary action, enabled as soon as the role family is set. Nothing is editable.
 */
function familySet(scorecard) {
  return Boolean(scorecard?.family && scorecard?.domainCompetency)
}

export default function ReviewRoleScreen({ roleTitle = '', scorecard: scorecardProp, probes = [], onBack, onSubmit }) {
  const scorecard = scorecardProp ?? roleScorecard({ title: roleTitle })
  const complete = familySet(scorecard)

  return (
    <Shell
      active="Roles"
      breadcrumb="Roles · Review"
      title={roleTitle}
      onNavigate={() => onBack?.()}
      action={
        <Button
          onClick={onSubmit}
          disabled={!complete}
          variant="secondary"
          className="shrink-0 !border-ink !bg-ink !py-2 !text-[13px] !text-white"
        >
          {/* "Submit role" is verbatim PRD. */}
          Submit role
        </Button>
      }
    >
      <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
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
    </Shell>
  )
}

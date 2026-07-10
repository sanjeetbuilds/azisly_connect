import { Button } from '../components'
import RoleCard from '../components/RoleCard.jsx'
import { CopyNeeded, AuthoringNeeded } from '../components/Spec.jsx'
import { ArrowLeftIcon } from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'

/*
 * ReviewRoleScreen — review the panel and submit.
 *
 * "Submit role" is enabled as soon as the role family is set — a person who said
 * nothing can still submit, because the family already defined the role. If it is
 * disabled (no family), the reason is named on screen. Nothing on the panel is
 * editable, so there is no edit control.
 */
function familySet(scorecard) {
  return Boolean(scorecard?.family && scorecard?.domainCompetency)
}

export default function ReviewRoleScreen({
  roleTitle = '',
  scorecard: scorecardProp,
  probes = [],
  onBack,
  onSubmit,
}) {
  const scorecard = scorecardProp ?? roleScorecard({ title: roleTitle })
  const complete = familySet(scorecard)

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 pl-16 pr-8 pt-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        )}
        <div>
          {/* The role title is the page title. The craft is not repeated here. */}
          <p className="text-[13px] font-medium text-secondary">Review the role</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">{roleTitle}</h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-28 pl-16 pr-8 pt-6">
        <div className="w-full max-w-[760px]">
          <RoleCard scorecard={scorecard} probes={probes} />
        </div>
      </div>

      {/* Sticky action bar — aligned to the same margin and max-width as the card. */}
      <div className="absolute inset-x-0 bottom-0 border-t border-hairline bg-background/90 py-4 pl-16 pr-8 backdrop-blur">
        <div className="flex w-full max-w-[760px] items-center justify-between gap-3">
          <div className="min-w-0 text-[13px]">
            {complete ? (
              <span className="text-secondary">
                You can submit now. Anything you add changes what we ask, not who qualifies.
              </span>
            ) : (
              // The reason Submit is disabled, named on screen.
              <span className="flex flex-wrap items-center gap-2">
                <AuthoringNeeded note="no role family set — required before Submit" />
                <CopyNeeded note="submit-disabled reason sentence" />
              </span>
            )}
          </div>
          {/* Nothing on the panel is editable, so there is no edit control. */}
          <Button onClick={onSubmit} disabled={!complete}>
            {/* "Submit role" is verbatim PRD. */}
            Submit role
          </Button>
        </div>
      </div>
    </div>
  )
}

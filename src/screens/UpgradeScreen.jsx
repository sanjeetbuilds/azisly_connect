import { Button, PageHeader } from '../components'
import { SparkleIcon } from '../components/icons.jsx'

/**
 * UpgradeScreen — placeholder destination for every "Upgrade" CTA (job limit,
 * interview-credit limit). The real plans-and-billing flow isn't built yet;
 * this just gives every blocked state somewhere honest to send the recruiter.
 */
export default function UpgradeScreen({ onBack }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <PageHeader breadcrumb={['Workspace', 'Upgrade']} title="Upgrade" />
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 pb-16">
        <div className="flex max-w-sm flex-col items-center gap-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-surface text-secondary shadow-card">
            <SparkleIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg text-ink">Plans aren&rsquo;t live yet</h2>
            <p className="text-sm leading-relaxed text-secondary">
              Billing and plan upgrades are coming soon. In the meantime, reach out to your Azisly
              contact to raise your limits.
            </p>
          </div>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}

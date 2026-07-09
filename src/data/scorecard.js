// The role scorecard model.
//
// A scorecard is assembled from the confirmed role family. It carries no default
// gate: gates come from the family and criteria are authored by hand. There is no
// fallback. A family with no gates is an error, not something this file papers
// over. There is no emphasis — it was never a real dimension.
//
//   family            the matched family name, or null when nothing matched
//   domainCompetency  the one competency that makes this role what it is
//   gates             exactly the family's two gates (internal; never rendered)
//   criteria          authored by hand; ships empty; empty renders AUTHORING NEEDED
//   probes            what the recruiter said, each { phrase, competency }; starts empty

import { matchFamily } from './roleFamilies.js'

export function roleScorecard({ title = '' } = {}) {
  const family = matchFamily(title)
  if (!family) {
    // No family owns this title. The unmatched screen resolves it; nothing here
    // fabricates a domain or a gate to fill the hole.
    return {
      family: null,
      domainCompetency: null,
      gates: [],
      criteria: [],
      probes: [],
    }
  }
  return {
    family: family.name,
    domainCompetency: family.domainCompetency,
    gates: family.gates,
    criteria: family.criteria,
    probes: [],
  }
}

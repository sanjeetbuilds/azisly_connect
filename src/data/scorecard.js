// The role scorecard model.
//
// A scorecard is assembled from the confirmed role family. It carries no default
// gate: gates come from the family and the criteria are authored by hand. There
// is no fallback and no emphasis — the person defining the role never sets how a
// candidate is scored, only what is asked.
//
//   family            the matched family name, or null when nothing matched
//   domainCompetency  the one competency that makes this role what it is
//   gates             exactly the family's two gates (internal; never rendered)
//   criteria          the ladder, each { text, tier }; ships empty ⇒ AUTHORING NEEDED
//   probes            what the recruiter said; each { phrase, competency, promise }

import { matchFamily } from './roleFamilies.js'

export function roleScorecard({ title = '' } = {}) {
  const family = matchFamily(title)
  if (!family) {
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

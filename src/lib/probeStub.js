// STUB — phrase → competency mapping.
//
// There is NO real implementation and you must not add one. The real engine reads
// the phrase and decides which of the role's 7 competencies (6 universal + the
// family domain) it tests. This stub ignores the phrase entirely and returns a
// fixed, fake sequence read from fixtures.js (STUB_PROBE_ORDER). Because the
// mapping is fake, every probe row rendered from it is tagged FIXTURE in the UI.
// Logged in STUBS.md.
import { UNIVERSAL_COMPETENCIES } from '../data/roleFamilies.js'
import { STUB_PROBE_ORDER } from '../data/fixtures.js'

export function classifyProbeStub(index, domainCompetency) {
  const seven = [...UNIVERSAL_COMPETENCIES, domainCompetency]
  const pick = STUB_PROBE_ORDER[index % STUB_PROBE_ORDER.length]
  return seven[pick % seven.length]
}

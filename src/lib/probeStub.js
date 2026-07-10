// STUB — phrase → probe mapping.
//
// There is NO real implementation and you must not add one. The real engine reads
// the phrase and decides both the competency it tests and the promise we make to
// the recruiter ("We'll ask …"). This stub ignores the phrase and returns fixed
// fake values read from fixtures.js. Because the mapping is fake, every probe row
// rendered from it is tagged FIXTURE in the UI. Logged in STUBS.md.
//
// Returns { phrase, competency, promise }:
//   phrase      the person's exact words (never rendered by the stub itself)
//   competency  internal, never shown to the recruiter
//   promise     the sentence shown to the recruiter under the phrase
import { UNIVERSAL_COMPETENCIES } from '../data/roleFamilies.js'
import { STUB_PROBE_ORDER, STUB_PROBE_PROMISES } from '../data/fixtures.js'

export function classifyProbeStub(phrase, index, domainCompetency) {
  const seven = [...UNIVERSAL_COMPETENCIES, domainCompetency]
  const pick = STUB_PROBE_ORDER[index % STUB_PROBE_ORDER.length]
  return {
    phrase,
    competency: seven[pick % seven.length],
    promise: STUB_PROBE_PROMISES[index % STUB_PROBE_PROMISES.length],
  }
}

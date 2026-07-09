// STUB — probe classification. The real engine reads a phrase and decides which
// of the seven competencies it tests. This interim version cannot read meaning,
// so it assigns competencies round-robin by probe index. It fakes the MAPPING
// (mechanism), never the words: the phrase shown is always the recruiter's exact
// words, and the competency name is one of the seven authored competencies.
// Logged in STUBS.md.
import { UNIVERSAL_COMPETENCIES } from '../data/roleFamilies.js'

export function classifyProbeStub(index) {
  return UNIVERSAL_COMPETENCIES[index % UNIVERSAL_COMPETENCIES.length]
}

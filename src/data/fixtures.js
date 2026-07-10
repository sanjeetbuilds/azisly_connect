// Fixtures — sample content used ONLY to make static state screens reachable
// with no data setup. Every value here is fake. Anything rendered from this file
// MUST carry a visible FIXTURE tag in the UI (see components/Spec.jsx → FixtureTag).
//
// Fixtures fake CONTENT, which is why they are quarantined here and labelled on
// screen. They never leak into the live recruiter flow, where the same slots are
// filled by real user input, a real family match, or a real uploaded file.

// The running demo roles for /states.
export const DEMO_ROLE_TITLE = 'Associate Product Manager' // matches Product Manager (criteria authored)
export const DEMO_UNMATCHED_TITLE = 'Growth PM' // matches no family

// A fake uploaded filename for the JD upload states. In the live flow the
// filename is read from the actual File object.
export const DEMO_JD_FILENAME = 'example-job-description.pdf'

// Fake pasted JD text, shown back unchanged in the paste states. In the live
// flow this is exactly what the recruiter pasted, stored and echoed verbatim.
export const DEMO_PASTED_JD =
  'This is placeholder job-description text standing in for whatever the recruiter pastes. Nothing is extracted from it in this build.'

// Fake voice answers. In the live flow these are the recruiter's spoken words
// (real speech-to-text). Here there is no STT, so a spoken turn plays one of
// these back, tagged FIXTURE. Ordered to answer the opening then the follow-ups.
export const DEMO_VOICE_ANSWERS = [
  'only PM in the company',
  'founder changes direction a lot',
  'the founder, two engineers, and a designer',
]

// A fake in-progress transcript line for the voice "transcript building" state.
export const DEMO_VOICE_PARTIAL = 'they need to be able to drive a launch on their own'

// STUB DATA — the fake phrase→competency sequence the probe mapper returns, as
// indices into the role's 7 competencies (6 universal + domain). Arbitrary; it
// ignores the phrase. The real engine classifies by meaning. See lib/probeStub.js.
export const STUB_PROBE_ORDER = [3, 6, 1, 4, 0, 5, 2]

// STUB DATA — the fake "what we'll ask" promises the mapper returns, by index.
// The real engine writes a promise from the phrase; this ignores it. The first
// two pair with the two demo phrases above.
export const STUB_PROBE_PROMISES = [
  "We'll ask what they did when nobody told them what to do next.",
  "We'll ask about a time priorities shifted under them, and what they did.",
  "We'll ask how they kept a small team pulling the same way.",
]

// STUB DATA — the phrases a fake JD "extracts". No JD is parsed; these stand in.
export const DEMO_JD_PHRASES = ['growth experiments', 'working closely with a small engineering team']

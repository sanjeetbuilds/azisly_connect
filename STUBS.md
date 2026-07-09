# Stubs — Create &amp; Define a Role (C2)

This repo is a design specification. It builds **states and copy**, not plumbing.
Everything faked is listed below. A stub may fake **timing, network, and state
transitions**. It may **not** fake content: any stub that needs content reads it
from [`src/data/fixtures.js`](src/data/fixtures.js), and every fixture value is
labelled **FIXTURE** in the UI (`components/Spec.jsx → FixtureTag`).

| # | What is faked | Where | What the real system does instead | Who implements it |
|---|---|---|---|---|
| 1 | **Probe → competency mapping** — `probeStub.js` ignores the phrase and returns a fixed fake sequence read from `fixtures.js` (`STUB_PROBE_ORDER`) over the role's 7 competencies (6 universal + domain). The phrase shown is always the recruiter's exact words; the → competency is faked, so **every probe row is tagged FIXTURE** in the UI. | `src/lib/probeStub.js`, `src/data/fixtures.js` | Reads each phrase and classifies it to the competency it actually tests. | Scoring / Engine |
| 2 | **Closest-family ranking** on the unmatched screen — word-overlap score, first family on a tie. Only pre-selects the guess the recruiter confirms or overrides; decides nothing that ships. | `src/data/roleFamilies.js` → `guessFamily` | Ranks families semantically against the title. | Jobs &amp; JD mapping |
| 3 | **JD reading** — real state sequence (`Uploading… → Uploaded → Reading the JD…`), extracts nothing. Filename and pasted text are shown back unchanged. No card field is written from a JD. | `src/screens/DefineRoleScreen.jsx` | Parses the JD, pre-fills the card, and asks only what the JD did not answer. | Jobs &amp; JD mapping / Engine |
| 4 | **Voice capture** — no speech-to-text exists, so a spoken turn plays back a fixture answer (tagged **FIXTURE**) which becomes a probe like a typed turn. The states `listening / not caught → re-ask / transcript building` are real. | `src/screens/DefineRoleScreen.jsx`, `src/data/fixtures.js` | Speech-to-text turns the recruiter's real words into a probe. | Voice / Platform |
| 5 | **Analytics events** — logged to the console. Event names are the PRD's verbatim. | `src/lib/analytics.js` | Sends `role_define_started`, `role_probing_shown`, `role_flagged_to_ops`, `role_submitted`, … to the analytics sink. | Data / Platform |
| 6 | **Magic-link validity &amp; expiry** — the three link states are rendered directly; token issue/verify is not enforced here. | `src/screens/MagicLinkScreen.jsx` (states); `src/lib/magicLink.js` (token encode/decode only) | Issues, verifies, and expires one-week single-role tokens; expires on submit. | Platform / Auth |
| 7 | **Pause &amp; resume persistence** — not built. The "resumed, part filled" state is rendered from fixture probes. | `/states → define-resumed` | Autosaves every answer + the part-built card; resumes at the next unanswered question. | Backend |
| 8 | **Submit → Matching handoff** — no matching runs. Peripheral gap shows a candidate-list slot; load-bearing gap shows the calm wait. | `SubmitPeripheralScreen.jsx`, `FindingCandidatesScreen.jsx` | Runs matching on everything mapped; ops resolves load-bearing gaps in the background. | Matching PRD / Ops |
| 9 | **Fixture content** — sample role title, unmatched title, JD filename, pasted JD, resumed probes, and the complete-card emphasis/criteria used to demo the enabled-Submit review state. All labelled FIXTURE on screen. | `src/data/fixtures.js` | Real user input, a real family match, a real uploaded file, and hand-authored emphasis/criteria in `roleFamilies.js`. | Recruiter / authors |

## Copy discipline

Every user-facing string is one of: **typed by a user**, **authored in
`roleFamilies.js`**, or **taken verbatim from the PRD / this build brief**. Any
other string renders **COPY NEEDED** in red. Any authored array that ships empty
(`emphasis`, `criteria`) renders **AUTHORING NEEDED** in red. Nothing is filled
with a default, a sample, or a guess.

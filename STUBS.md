# Stubs — Create &amp; Define a Role (C2)

This repo is a design specification. It builds **states and copy**, not plumbing.
Everything faked is listed below. A stub may fake **timing, network, and state
transitions**. It may **not** fake content: any stub that needs content reads it
from [`src/data/fixtures.js`](src/data/fixtures.js), and every fixture value is
labelled **FIXTURE** in the UI (`components/Spec.jsx → FixtureTag`).

| # | What is faked | Where | What the real system does instead | Who implements it |
|---|---|---|---|---|
| 1 | **Probe mapping** — `probeStub.js` returns `{ phrase, competency, promise }` but ignores the phrase: the internal `competency` and the recruiter-facing `promise` ("We'll ask …") are both read from fixed fake sequences in `fixtures.js` (`STUB_PROBE_ORDER`, `STUB_PROBE_PROMISES`). The phrase shown is the recruiter's exact words; because the mapping is faked, **every probe row is tagged FIXTURE**. | `src/lib/probeStub.js`, `src/data/fixtures.js` | Reads each phrase and writes both the competency it tests and the promise shown to the recruiter. | Scoring / Engine |
| 3 | **JD reading** — real state sequence (`Uploading… → Uploaded → Reading the JD…`), extracts nothing. Filename and pasted text are shown back unchanged. No card field is written from a JD. | `src/screens/DefineRoleScreen.jsx` | Parses the JD, pre-fills the card, and asks only what the JD did not answer. | Jobs &amp; JD mapping / Engine |
| 4 | **Voice capture** — no speech-to-text exists, so a spoken turn plays back a fixture answer (tagged **FIXTURE**) which becomes a probe like a typed turn. The states `listening / not caught → re-ask / transcript building` are real. | `src/screens/DefineRoleScreen.jsx`, `src/data/fixtures.js` | Speech-to-text turns the recruiter's real words into a probe. | Voice / Platform |
| 5 | **Analytics events** — logged to the console. Event names are the PRD's verbatim. | `src/lib/analytics.js` | Sends `role_define_started`, `role_probing_shown`, `role_flagged_to_ops`, `role_submitted`, … to the analytics sink. | Data / Platform |
| 6 | **Magic-link validity &amp; expiry** — the three link states are rendered directly; token issue/verify is not enforced here. | `src/screens/MagicLinkScreen.jsx` (states); `src/lib/magicLink.js` (token encode/decode only) | Issues, verifies, and expires one-week single-role tokens; expires on submit. | Platform / Auth |
| 7 | **Pause &amp; resume persistence** — not built. The "resumed, part filled" state is rendered from fixture probes. | `/states → define-resumed` | Autosaves every answer + the part-built card; resumes at the next unanswered question. | Backend |
| 8 | **Submit → Matching handoff** — no matching runs. The peripheral gap shows a candidate-list slot. There is no load-bearing gap: the craft comes from a picked role and cannot be missing. | `SubmitPeripheralScreen.jsx` | Runs matching on everything mapped; ops resolves peripheral gaps in the background. | Matching PRD / Ops |
| 9 | **Fixture content** — sample role title, JD filename, pasted JD, voice answers, and the JD-extracted phrases, used to make the /states screens reachable. All labelled FIXTURE on screen. | `src/data/fixtures.js` | Real user input, a real uploaded file, and real speech-to-text. | Recruiter / authors |

## Copy discipline

Every user-facing string is one of: **typed by a user**, **authored in
`roleFamilies.js`**, or **taken verbatim from the PRD / this build brief**. Any
other string renders **COPY NEEDED** in red. Any authored array that ships empty
(`emphasis`, `criteria`) renders **AUTHORING NEEDED** in red. Nothing is filled
with a default, a sample, or a guess.

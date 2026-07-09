# Post-MVP: Role Define + Interview rework

Parked on branch `post-mvp/role-define-rework`. `master` is untouched and is what
deploys to production. Nothing here has shipped.

Last touched: paused to return in about a month. Build is green (`npx vite build`
passes). Everything was verified against the local dev server only (`npx vite`),
not screenshot-tested.

---

## What this work is

A ground-up rework of how a recruiter defines a role and understands how the AI
will interview for it. It replaces the old "role card = weighted competencies"
model with a recruiter-facing **criteria list**, and replaces the editable
question list with a read-only **interview composition map**.

Guiding principles that emerged across the iterations:

- The recruiter speaks in their own language (criteria like "Product Sense"), not
  our framework (competency, domain, gate, weight, floor). The framework is mapped
  behind the scenes and never shown on screen.
- We hire FRESHERS: never generate an experience/tenure criterion.
- The AI adapts interview questions live, so we never show a fixed, editable
  question list. We show HOW we will interview and GUARANTEE coverage instead.
- Hierarchy comes from grouping, typography, and space. No coloured left/top edge
  rails anywhere. No em-dashes in copy.

---

## Where things stand (done)

### Model: `src/data/scorecard.js`
- **Role families** (`FAMILIES`, `roleFamily`, `roleDomain`): title maps to one of
  ~7 families (product, engineering, frontend, design, eng-management, data, ml).
  Unmapped titles return null (ops-flag case).
- **Criteria model** (`roleCriteria(title)`): per-family list of criteria in
  recruiter language, each `{ id, name, desc, importance, comp }`. `comp` is the
  hidden internal mapping to one of our seven competencies.
- **Three importance levels**: `essential` / `veryImportant` / `nice` (2 / 3 / 2
  per family). Exactly two Essential = the family's two gates in recruiter words.
- `DEFAULT_GATES` is now `[]` (nothing pre-filled; no experience gates).
- `suggestionsFor`, `REUSE_POOL`, `competencyMeaning`, `translateConcern`.
- **Interview generation**: `buildInterview` / `INTERVIEW_SECTIONS` /
  `estimatedMinutes` / `untestedEssentials` / `questionFor` still exist and are
  used by `RoleCompleteScreen` for counts/minutes. `approachFor(name)` returns the
  per-criterion `{ approach, listen, mode }` used by the interview map (mode:
  `interview` default, `read` for Communication, `profile` for location/language).

### Define screen: `src/screens/DefineRoleScreen.jsx` (current state)
Two-column composition: a quiet ~200px left margin per importance group (label,
count, one-line purpose) and a wide right column of criteria as a **2-up grid**.
- No rails/dots. Essential cards get a very slightly stronger border.
- Per-card three-dot menu opens on CLICK and renders in a **React portal** at high
  z-index (never clipped). Items: Move to Essential/Very important/Nice to have,
  Edit (inline), Remove. Moving animates the card into its new group.
- **Essential cap**: a third Essential flips the group line to a gentle warning.
- **Composer bar** pinned at the bottom (attach / mic / text / send). Type or
  speak enriches the list and briefly highlights the change; dropping a JD makes a
  bigger change with a summary + Undo. Optional; the card is complete without it.
- Actions: `+ Add criterion`, `Reuse from another role`, primary
  `Looks good, continue`.

### Interview screen: `src/screens/InterviewReviewScreen.jsx` (current state, most recent work)
A read-only **proportional composition map**, one fold, no scroll, no rails.
- Boxes = Essential + Very important criteria; **box area = share of the
  interview**. Two rows (Essential on top, biggest). Tone (single ink hue) carries
  importance. Header line: "Where the 25 minutes go" / "adapts live to their
  answers".
- **Foundation band** (dashed hairline): "Read from every answer" lists the
  read-mode universals (Communication) that take no box.
- Hover a box for a **+/- stepper** that shifts its share and shows the writeback
  line ("Raising X also raises it on your role card").
- Clicking a box opens a **listen-fors panel in the right-hand space** (one at a
  time, map stays visible).
- **Coverage guarantee**: an Essential/Very important criterion with no share
  renders as an outlined "Not yet covered" box; profile-only criteria go to a
  footnote ("Checked from their profile, not the interview: ...").
- Appears as a panel right after the role card is approved; the hiring manager
  sees it too. Actions: `Back to criteria` + primary `Start sourcing`
  (`confirmLabel` prop; ManagerFlow passes "Save and send to recruiter").

### Completion + matching
- `src/screens/RoleCompleteScreen.jsx`: post-submit screen. CREATED (done, green
  checks) vs IN PROGRESS (matching, live pulse, never a tick), reassurance raised
  to hero, CTA "Watch sourcing" + "Back to roles". Interview item is "Interview
  ready, adaptive, about N minutes, See how".
- `src/components/MatchingProgress.jsx`: calm end state; removed the
  "prototype simulation" footnote.

### Candidate side (also reworked this session)
- `src/components/CandidateDetail.jsx`: post-interview panel. Distinct floor (flat,
  universals) vs role-target (domain) markers; emphasis tags; LOUD failed-gate and
  below-floor states; a "What to do next" recommendations list; **explanation-first
  evidence** (a plain-language finding leads, the verbatim quote is behind Expand);
  recruiter probe phrases carried through.
- `src/components/CandidateTable.jsx`: the interview breakdown now opens from a
  **popover on the score only** (`ScorePopover`), anchored to the side so the list
  stays usable (was a row-hover panel that covered other rows).
- `src/components/CandidateReport.jsx` + `src/lib/reportData.js` + `exports.js`:
  a shareable candidate report (Share link / Email / Download) plus the
  taken-forward export set (CSV / CVs / Reports).
- Findings authored on evidence entries in `src/data/candidates.js`
  (`ROLE_PROBES`, `UNIVERSAL_FLOOR`, `finding` fields).
- New shared components: `CompetencyBreakdown.jsx`, `RungTag.jsx`. New icons and
  an `indeterminate` keyframe in `index.css`.

### Flow wiring
- `src/App.jsx`: define -> review card -> approve -> interview panel -> completion
  -> sourcing. `interviewFrom` routes the panel back to where it was opened from
  (define / candidates invite-nudge / completion Preview). Invite nudge if the
  recruiter invites without seeing the interview.
- `src/screens/ManagerFlow.jsx`: hiring-manager magic link now runs
  entry -> define -> interview panel -> done, so the manager finishes knowing how
  their role will be assessed.

---

## What is NOT done / known gaps (pick these up next)

1. **Criteria are not threaded through the flow.** Each screen regenerates from
   the title via `roleCriteria(title)`. So edits the recruiter makes on the Define
   screen (add / move / remove / rename criteria, composer/JD changes) do NOT
   persist into the Review card or the interview map. This is the biggest thing to
   fix: lift the criteria list into shared state (App-level or a context) and pass
   it through define -> review -> interview -> complete.

2. **`ReviewRoleScreen.jsx` is stale.** It still renders the old role-card model
   (`roleScorecard` / must-haves / JD) and has not been re-fitted to the criteria
   list. With `DEFAULT_GATES` now empty it shows the no-gate state, but it should
   either be rebuilt around the criteria list or removed from the flow (define ->
   approve -> interview panel directly). Decide which.

3. **Interview map: drag-the-divider not implemented.** Only the +/- stepper works
   for shifting a criterion's share. The "drag the boundary between two boxes"
   interaction is still to build.

4. **Writeback is cosmetic.** The stepper shows "raises it on your role card" but
   does not actually mutate a shared criteria state (see gap 1).

5. **Reopen from the role page.** The interview panel is reachable after approval,
   from the completion screen ("See how"), and from the candidates invite nudge,
   but there is no direct "How we'll interview" entry point on the role's page.

6. **Downstream copy/provenance.** Some earlier-iteration surfaces (e.g. review
   card) were not given the "source line" / provenance treatment that an earlier
   design pass called for; that pass was later superseded by the criteria-list
   direction, so confirm the intended end state before reviving it.

7. **Ops-flag / unmapped-family path** exists in the model (roleFamily returns
   null) but the Define screen falls back to a generic criteria list rather than
   surfacing an explicit "flagged to ops" state. Decide the desired behaviour.

8. Not visually QA'd. Build passes and it was clicked through on the dev server,
   but no cross-browser or screenshot review.

---

## What I was in the middle of

Just finished rebuilding `InterviewReviewScreen.jsx` into the proportional
composition map (the newest work). Nothing was left half-edited; the build is
green. The natural next task is **gap 1** (thread the criteria list through the
flow) so that the Define screen, the Review card, and the interview map all read
from and write to one shared criteria state, which then makes gaps 2 and 4
tractable.

## How to resume

```
git checkout post-mvp/role-define-rework
npm install        # if needed
npx vite           # dev server, then open the printed localhost URL
npx vite build     # sanity check, should pass
```

Walk the flow: Roles -> New role -> "Product Manager" -> Looks good, continue ->
Approve on the card -> the interview composition map appears.

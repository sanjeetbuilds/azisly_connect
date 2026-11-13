import { useMemo, useState } from 'react'
import { Button, ConfirmDialog, Tag } from '../components'
import Shell from '../components/Shell.jsx'
import { AuthoringNeeded } from '../components/Spec.jsx'
import { LockIcon, PlusIcon, ClockIcon, ChevronDownIcon, XIcon } from '../components/icons.jsx'
import { matchFamily } from '../data/roleFamilies.js'
import {
  INTERVIEW_SECTIONS,
  MAX_QUESTIONS,
  TARGET_MAX_MINUTES,
  buildInterview,
  estimatedMinutes,
  newQuestion,
  questionWhy,
  rubricFor,
  untestedCompetencies,
} from '../data/interviewQuestions.js'
import { CONFIRM_COPY } from '../lib/roleStatus.js'
import { track } from '../lib/analytics.js'

/*
 * InterviewQuestionsScreen — the recruiter's editable interview.
 *
 * Suggested questions come from the role card (one per criterion, plus a
 * warm-up). The recruiter can reword any question, add their own, remove any
 * that is not Essential, reorder within a section, and mark a question must ask
 * (which moves it to Core). Wording is theirs; what a question scores is fixed
 * and shown as tags. Essential questions are locked: reword only.
 */

// Read from every answer (RoleCard's foundation line), so never flagged untested.
const READ_FROM_EVERY_ANSWER = ['Communication', 'Ownership']
const MAX_COMPETENCIES = 2

const sectionFor = (q) => (q.section === 'warmup' ? 'warmup' : q.mustAsk ? 'core' : 'role')

function MiniButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`text-[12px] font-medium text-secondary transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function CompetencyPicker({ rubric, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {rubric.map((c) => {
        const on = value.includes(c)
        const full = !on && value.length >= MAX_COMPETENCIES
        return (
          <button
            key={c}
            type="button"
            disabled={full}
            onClick={() => onChange(on ? value.filter((x) => x !== c) : [...value, c])}
            className={`rounded-full border px-2.5 py-0.5 text-[12px] font-medium transition-colors disabled:opacity-30 ${
              on ? 'border-ink bg-ink text-white' : 'border-hairline text-secondary hover:border-ink/30 hover:text-ink'
            }`}
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}

function QuestionRow({ q, index, first, last, onChange, onRemove, onMove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(q.text)
  const reworded = q.suggestedText && q.text !== q.suggestedText

  const save = () => {
    const text = draft.trim()
    if (!text) return
    onChange({ ...q, text })
    setEditing(false)
  }

  return (
    <li className="group flex gap-4 border-b-[0.5px] border-hairline py-4 last:border-b-0">
      <span className="w-5 shrink-0 pt-0.5 font-mono text-[12px] text-muted">{index}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save()
                if (e.key === 'Escape') {
                  setDraft(q.text)
                  setEditing(false)
                }
              }}
              className="w-full resize-none rounded-md border border-hairline bg-surface px-3 py-2 text-[14px] leading-[1.5] text-ink outline-none focus:border-ink/40"
            />
            <div className="flex items-center gap-3">
              <Button onClick={save} disabled={!draft.trim()} className="!py-1.5 !text-[12px]">
                Save wording
              </Button>
              <MiniButton
                onClick={() => {
                  setDraft(q.text)
                  setEditing(false)
                }}
              >
                Cancel
              </MiniButton>
              <span className="text-[12px] text-muted">Rewording never changes what it scores.</span>
            </div>
          </div>
        ) : (
          <p className="text-[14px] leading-[1.5] text-ink">{q.text}</p>
        )}

        <p className="text-[12px] leading-[1.5] text-secondary">{questionWhy(q)}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          {q.competencies.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
          {q.origin === 'added' && <Tag color="blue">Added by you</Tag>}
          {reworded && <Tag color="amber">Reworded</Tag>}
        </div>
      </div>

      <div className="flex w-[180px] shrink-0 flex-col items-end gap-2">
        {q.section === 'warmup' ? (
          <span className="text-[12px] text-muted">Always first</span>
        ) : q.locked ? (
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-ink" title="Essential criteria are always asked">
            <LockIcon className="h-3 w-3" /> Must ask
          </span>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium text-secondary">
            <input
              type="checkbox"
              checked={q.mustAsk}
              onChange={(e) => onChange({ ...q, mustAsk: e.target.checked })}
              className="h-3.5 w-3.5 accent-[var(--color-ink)]"
            />
            Must ask
          </label>
        )}
        {!editing && (
          <div className="flex items-center gap-3 opacity-60 transition-opacity group-hover:opacity-100">
            <MiniButton onClick={() => onMove(-1)} disabled={first} aria-label="Move up">
              <ChevronDownIcon className="h-3.5 w-3.5 rotate-180" />
            </MiniButton>
            <MiniButton onClick={() => onMove(1)} disabled={last} aria-label="Move down">
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </MiniButton>
            <MiniButton onClick={() => setEditing(true)}>Edit</MiniButton>
            {reworded && (
              <MiniButton onClick={() => onChange({ ...q, text: q.suggestedText })}>Reset</MiniButton>
            )}
            {!q.locked && q.section !== 'warmup' && (
              <MiniButton onClick={onRemove} className="hover:!text-danger">
                Remove
              </MiniButton>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

function AddQuestionForm({ rubric, onAdd, onCancel }) {
  const [text, setText] = useState('')
  const [competencies, setCompetencies] = useState([])
  const [mustAsk, setMustAsk] = useState(false)
  const valid = text.trim() && competencies.length > 0

  return (
    <div className="flex flex-col gap-4 rounded-[10px] border-[0.5px] border-hairline bg-surface px-5 py-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-ink" htmlFor="new-question">
          Your question
        </label>
        <textarea
          id="new-question"
          autoFocus
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask it the way you would in person."
          className="w-full resize-none rounded-md border border-hairline bg-surface px-3 py-2 text-[14px] leading-[1.5] text-ink outline-none placeholder:text-muted focus:border-ink/40"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[13px] font-medium text-ink">
          What should it test? <span className="font-normal text-muted">Pick one or two.</span>
        </p>
        <CompetencyPicker rubric={rubric} value={competencies} onChange={setCompetencies} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-secondary">
          <input
            type="checkbox"
            checked={mustAsk}
            onChange={(e) => setMustAsk(e.target.checked)}
            className="h-3.5 w-3.5 accent-[var(--color-ink)]"
          />
          Must ask (always asked, goes in Core)
        </label>
        <div className="flex items-center gap-3">
          <MiniButton onClick={onCancel}>Cancel</MiniButton>
          <Button
            disabled={!valid}
            className="!py-1.5 !text-[12px]"
            onClick={() => onAdd(newQuestion({ text: text.trim(), competencies, mustAsk }))}
          >
            Add question
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function InterviewQuestionsScreen({
  roleTitle = '',
  probes = [],
  questions: questionsProp,
  initialAdding = false,
  onBack,
  onSubmit,
  onDiscard,
  submitLabel = 'Submit role',
}) {
  const family = matchFamily(roleTitle)
  const suggested = useMemo(() => buildInterview({ title: roleTitle, probes }), [roleTitle, probes])
  const [questions, setQuestions] = useState(questionsProp ?? suggested)
  const [adding, setAdding] = useState(initialAdding)
  const [removed, setRemoved] = useState(null) // { q, index } for Undo
  const [discardOpen, setDiscardOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const rubric = rubricFor(roleTitle)
  const minutes = estimatedMinutes(questions.length)
  const overTime = minutes > TARGET_MAX_MINUTES
  const atMax = questions.length >= MAX_QUESTIONS
  const untested = untestedCompetencies(roleTitle, questions).filter((c) => !READ_FROM_EVERY_ANSWER.includes(c))
  const criteriaMissing = (family?.criteria ?? []).length === 0

  const update = (next) => setQuestions(questions.map((q) => (q.id === next.id ? next : q)))
  const remove = (q) => {
    const index = questions.findIndex((x) => x.id === q.id)
    setQuestions(questions.filter((x) => x.id !== q.id))
    setRemoved({ q, index })
    track('interview_question_removed', { origin: q.origin })
  }
  const undoRemove = () => {
    if (!removed) return
    const next = [...questions]
    next.splice(removed.index, 0, removed.q)
    setQuestions(next)
    setRemoved(null)
  }
  // Move within the question's own section, skipping over other sections.
  const move = (q, dir) => {
    const sec = sectionFor(q)
    const peers = questions.filter((x) => sectionFor(x) === sec)
    const j = peers.findIndex((x) => x.id === q.id) + dir
    if (j < 0 || j >= peers.length) return
    const a = questions.findIndex((x) => x.id === q.id)
    const b = questions.findIndex((x) => x.id === peers[j].id)
    const next = [...questions]
    ;[next[a], next[b]] = [next[b], next[a]]
    setQuestions(next)
  }

  let counter = 0
  return (
    <Shell
      active="Roles"
      breadcrumb="Roles · Interview questions"
      title={roleTitle}
      onNavigate={() => onBack?.(questions)}
      action={
        <div className="flex shrink-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={() => onBack(questions)}
              className="shrink-0 whitespace-nowrap text-[13px] font-medium text-secondary transition-colors hover:text-ink"
            >
              Back to role card
            </button>
          )}
          {onDiscard && (
            <button
              type="button"
              onClick={() => setDiscardOpen(true)}
              className="shrink-0 whitespace-nowrap text-[13px] font-medium text-secondary transition-colors hover:text-danger"
            >
              Discard
            </button>
          )}
          <Button
            onClick={() => {
              track('interview_questions_confirmed', {
                count: questions.length,
                added: questions.filter((q) => q.origin === 'added').length,
                reworded: questions.filter((q) => q.suggestedText && q.text !== q.suggestedText).length,
              })
              onSubmit?.(questions)
            }}
            disabled={questions.length === 0}
            variant="secondary"
            className="shrink-0 !border-ink !bg-ink !py-2 !text-[13px] !text-white"
          >
            {submitLabel}
          </Button>
        </div>
      }
    >
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="flex max-w-[820px] flex-col gap-6 pb-16">
          {/* Summary */}
          <div className="flex flex-col gap-2">
            <h2 className="text-[18px] font-medium text-ink">Interview questions</h2>
            <p className="text-[13px] leading-[1.5] text-secondary">
              We suggested these from your role card. Reword any of them, add your own, or remove ones you don&rsquo;t
              need. What each question scores stays fixed.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
              <span className="inline-flex items-center gap-1.5 text-ink">
                <ClockIcon className="h-3.5 w-3.5" />
                About {minutes} minutes · {questions.length} question{questions.length === 1 ? '' : 's'}
              </span>
              {overTime && (
                <span className="text-attention">
                  Over {TARGET_MAX_MINUTES} minutes. Candidates drop off in longer screens; consider removing one.
                </span>
              )}
              <MiniButton onClick={() => setResetOpen(true)} className="ml-auto">
                Reset to suggested
              </MiniButton>
            </div>
            {untested.length > 0 && (
              <p className="text-[12px] text-muted">Nothing tests {untested.join(', ')} yet.</p>
            )}
            {criteriaMissing && <AuthoringNeeded note={`question set for ${family?.name ?? 'this role'}: criteria not authored`} />}
          </div>

          {removed && (
            <div className="flex items-center justify-between rounded-md border-[0.5px] border-hairline bg-surface px-4 py-2 text-[13px]">
              <span className="text-secondary">Question removed.</span>
              <div className="flex items-center gap-3">
                <MiniButton onClick={undoRemove} className="!text-ink">
                  Undo
                </MiniButton>
                <MiniButton onClick={() => setRemoved(null)} aria-label="Dismiss">
                  <XIcon className="h-3.5 w-3.5" />
                </MiniButton>
              </div>
            </div>
          )}

          {/* Sections */}
          {INTERVIEW_SECTIONS.map((s) => {
            const items = questions.filter((q) => sectionFor(q) === s.key)
            return (
              <section key={s.key} className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[13px] font-medium text-ink">{s.title}</h3>
                  <span className="text-[12px] text-muted">{s.purpose}</span>
                </div>
                {items.length === 0 ? (
                  <p className="py-3 text-[13px] text-muted">No questions here.</p>
                ) : (
                  <ul className="rounded-[10px] border-[0.5px] border-hairline bg-surface px-5">
                    {items.map((q, i) => (
                      <QuestionRow
                        key={q.id}
                        q={q}
                        index={++counter}
                        first={i === 0}
                        last={i === items.length - 1}
                        onChange={update}
                        onRemove={() => remove(q)}
                        onMove={(dir) => move(q, dir)}
                      />
                    ))}
                  </ul>
                )}
              </section>
            )
          })}

          {/* Add */}
          {adding ? (
            <AddQuestionForm
              rubric={rubric}
              onCancel={() => setAdding(false)}
              onAdd={(q) => {
                setQuestions([...questions, q])
                setAdding(false)
                track('interview_question_added', { mustAsk: q.mustAsk, competencies: q.competencies })
              }}
            />
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="secondary" disabled={atMax} onClick={() => setAdding(true)} className="!py-2 !text-[13px]">
                <PlusIcon className="h-3.5 w-3.5" /> Add a question
              </Button>
              {atMax && <span className="text-[12px] text-muted">Up to {MAX_QUESTIONS} questions. Remove one to add another.</span>}
            </div>
          )}
        </div>
      </div>

      {resetOpen && (
        <ConfirmDialog
          title="Reset to suggested questions?"
          message="Your added questions and rewording will be lost."
          confirmLabel="Reset"
          onCancel={() => setResetOpen(false)}
          onConfirm={() => {
            setQuestions(buildInterview({ title: roleTitle, probes }))
            setRemoved(null)
            setResetOpen(false)
          }}
        />
      )}
      {discardOpen && (
        <ConfirmDialog
          {...CONFIRM_COPY.discard}
          onCancel={() => setDiscardOpen(false)}
          onConfirm={() => {
            setDiscardOpen(false)
            onDiscard()
          }}
        />
      )}
    </Shell>
  )
}

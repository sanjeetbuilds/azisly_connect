import { useState } from 'react'
import { Button, Card, Tag } from '../components'
import { SendIcon, CheckIcon } from '../components/icons.jsx'

const QUESTIONS = [
  'First up — what role are you hiring for?',
  'Nice. What does success look like in their first six months?',
  'Which three or four competencies matter most, and how should we weigh them?',
  'Last one — what’s the seniority and scope? Who do they work with day to day?',
]

/* A friendly assistant avatar. */
function Bot({ size = 40 }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2">
        <circle cx="9" cy="10.5" r="1.1" fill="currentColor" />
        <circle cx="15" cy="10.5" r="1.1" fill="currentColor" />
        <path
          d="M8.5 14.5c1.1 1.1 5.9 1.1 7 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 animate-spin text-secondary">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * TalkToDefine — the "Talk it through" mode: a friendly AI avatar walks the
 * user through defining the role one question at a time, building the same role
 * card the form produces. Avatar, current question, and the answer input are
 * always visible.
 */
export default function TalkToDefine({ onComplete }) {
  const [messages, setMessages] = useState([{ from: 'ai', text: QUESTIONS[0] }])
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('chat') // chat | building | ready

  const build = (extra) => {
    setMessages((m) => [...m, ...extra])
    setPhase('building')
    setTimeout(() => setPhase('ready'), 1400)
  }

  const submit = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    const next = step + 1
    if (next < QUESTIONS.length) {
      setMessages((m) => [...m, { from: 'user', text }, { from: 'ai', text: QUESTIONS[next] }])
      setStep(next)
    } else {
      build([{ from: 'user', text }])
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Persona header */}
      <div className="flex shrink-0 items-center gap-3 border-y border-hairline bg-surface px-6 py-3 lg:px-8">
        <Bot size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Azzy</p>
          <p className="text-[13px] text-secondary">Your Azisly hiring assistant</p>
        </div>
        {phase === 'ready' ? (
          <Tag color="green" className="ml-auto">
            <CheckIcon className="mr-1 h-3 w-3" /> Ready
          </Tag>
        ) : (
          phase === 'chat' && (
            <span className="ml-auto text-[13px] text-secondary">
              Question {step + 1} of {QUESTIONS.length}
            </span>
          )
        )}
      </div>

      {/* Conversation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-7 py-7">
          {messages.map((m, i) =>
            m.from === 'ai' ? (
              <div key={i} className="flex gap-3">
                <Bot size={28} />
                <p className="flex-1 pt-1 text-[15px] leading-relaxed text-ink">{m.text}</p>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-md border border-hairline bg-background px-4 py-2.5 text-[15px] leading-relaxed text-ink">
                  {m.text}
                </div>
              </div>
            ),
          )}

          {phase === 'building' && (
            <div className="flex gap-3">
              <Bot size={28} />
              <span className="flex items-center gap-2.5 pt-1 text-secondary">
                <Spinner /> Putting the role card together…
              </span>
            </div>
          )}

          {phase === 'ready' && (
            <>
              <div className="flex gap-3">
                <Bot size={28} />
                <p className="flex-1 pt-1 text-[15px] leading-relaxed text-ink">
                  Here&rsquo;s the role card from our chat — have a look and tweak anything.
                </p>
              </div>
              <Card className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg text-ink">Senior Product Engineer</h3>
                    <p className="mt-0.5 text-[13px] text-secondary">
                      1 opening · Remote · Europe · Full-time
                    </p>
                  </div>
                  <Tag color="purple">Draft</Tag>
                </div>
                <p className="text-sm leading-relaxed text-secondary">
                  Owns product-facing features end to end. Success in six months: two significant
                  launches and a measurable lift in activation.
                </p>
                <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
                  <Button onClick={onComplete}>Review role</Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Answer input — always visible while chatting */}
      {phase === 'chat' && (
        <div className="shrink-0 border-t border-hairline bg-background px-6 py-4 lg:px-8">
          <div className="mx-auto flex w-full max-w-2xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
              rows={1}
              placeholder="Type your answer…"
              className="flex-1 resize-none rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
            <Button onClick={submit} disabled={!input.trim()} aria-label="Send" className="!px-3.5">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

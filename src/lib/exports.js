// Client-side export helpers for the taken-forward launchpad. The CV documents
// and CV links are prototype stand-ins (no real cloud), but the CSV and text
// files download for real.
import { contactsFor, topExperienceOf } from '../data/candidates.js'
import { reportModel } from './reportData.js'

export function downloadFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const cvLink = (c) => `https://cloud.azisly.com/cv/${c.id}.pdf`
export const reportLink = (c) => `https://cloud.azisly.com/report/${c.id}`

function csvCell(v) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// CSV index of taken-forward candidates.
export function candidatesToCsv(list) {
  const header = ['Name', 'Experience', 'Interview score', 'CV link', 'Phone', 'Email']
  const rows = list.map((c) => {
    const { email, phone } = contactsFor(c.name)
    return [c.name, topExperienceOf(c) ?? 'Fresher', c.score ?? '', cvLink(c), phone, email]
      .map(csvCell)
      .join(',')
  })
  return [header.join(','), ...rows].join('\n')
}

// A single candidate's CV as plain text (the actual document).
export function candidateCv(c) {
  const { email, phone } = contactsFor(c.name)
  const lines = [
    c.name,
    c.role,
    '',
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    'Experience',
    ...(c.work?.length ? c.work.map((w) => `  - ${w}`) : ['  - No formal experience yet']),
    '',
    `Skills: ${c.skills.join(', ')}`,
    '',
    c.score != null ? `Interview score: ${c.score} (${c.verdict})` : 'Interview: not yet taken',
  ]
  if (c.projects?.length) {
    lines.push('', 'Projects', ...c.projects.map((p) => `  - ${p}`))
  }
  return lines.join('\n')
}

export function downloadCsv(list, filename = 'taken-forward.csv') {
  downloadFile(filename, candidatesToCsv(list), 'text/csv')
}

export function downloadCv(c) {
  downloadFile(`${slug(c.name)}-cv.txt`, candidateCv(c), 'text/plain')
}

// A combined pack of CVs (stands in for a zip in the prototype).
export function downloadCvPack(list, filename = 'cv-pack.txt') {
  const content = list.map(candidateCv).join('\n\n----------------------------------------\n\n')
  downloadFile(filename, content, 'text/plain')
}

// The candidate report as plain text: the shareable artifact, written to be
// forwarded to a hiring manager who was not in the loop.
export function candidateReport(c) {
  const m = reportModel(c)
  const rule = '========================================'
  const lines = [
    `CANDIDATE REPORT`,
    m.name,
    `${m.role}`,
    '',
    `Interview score: ${m.score ?? 'n/a'}${m.verdict ? ` (${m.verdict})` : ''}   Match: ${m.match ?? 'n/a'}`,
    `Verdict: ${m.reco}`,
    '',
    'WHAT TO DO NEXT',
    ...m.recommendations.map((r) => `  - ${r.text}`),
    '',
    rule,
    'COMPETENCIES AND EVIDENCE',
    '',
  ]
  for (const comp of m.competencies) {
    lines.push(`${comp.name}: ${comp.score}   ${comp.note.toUpperCase()}`)
    if (comp.phrase) lines.push(`  You asked to test: "${comp.phrase}"`)
    if (comp.evidence) {
      lines.push(`  "${comp.evidence.quote}"`)
      lines.push(`  ${comp.evidence.source ? `(${comp.evidence.source})` : ''}`.trimEnd())
    }
    lines.push('')
  }
  lines.push(
    rule,
    'CRITERIA THIS ROLE WAS ASSESSED AGAINST',
    m.criteria.domain ? `  Domain: ${m.criteria.domain}` : '',
    `  Very important: ${m.criteria.emphasis.join(', ') || 'none named'}`,
    `  Must have (gates): ${m.criteria.gates.join(', ')}`,
    ...Object.entries(m.criteria.probes).map(([k, v]) => `  Your words: "${v}" tested under ${k}`),
    '',
    rule,
    'CONTACT',
    `  Email: ${m.contacts.email}`,
    `  Phone: ${m.contacts.phone}`,
  )
  return lines.filter((l) => l !== undefined).join('\n')
}

export function downloadReport(c) {
  downloadFile(`${slug(c.name)}-report.txt`, candidateReport(c), 'text/plain')
}

// A combined pack of reports for the taken-forward set.
export function downloadReportPack(list, filename = 'candidate-reports.txt') {
  const content = list.map(candidateReport).join('\n\n\n')
  downloadFile(filename, content, 'text/plain')
}

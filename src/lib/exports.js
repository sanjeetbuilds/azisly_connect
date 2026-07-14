// Client-side export helpers for the taken-forward launchpad. The CV documents
// and CV links are prototype stand-ins (no real cloud), but the CSV and text
// files download for real.
import { contactsFor, topExperienceOf, verdictLabel } from '../data/candidates.js'

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
    c.incomplete
      ? 'Interview: incomplete'
      : c.score != null
        ? `Interview score: ${c.score} (${verdictLabel(c)})`
        : 'Interview: not yet taken',
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

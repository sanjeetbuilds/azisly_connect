// title-test.js — run role titles through the roleFamilies matcher.
//
// Usage:  node scripts/title-test.js <titles.txt>
//
// Reads titles from a text file, one per line, and prints two columns: the title,
// and the matched family name or UNMATCHED. No UI, no screen — this is the harness
// the PRD asks for ("Test before build") for checking real fresher titles against
// the 11-family library.
import fs from 'node:fs'
import { matchFamily } from '../src/data/roleFamilies.js'

const file = process.argv[2]
if (!file) {
  console.error('usage: node scripts/title-test.js <titles.txt>')
  process.exit(1)
}

const titles = fs
  .readFileSync(file, 'utf8')
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean)

const width = titles.reduce((w, t) => Math.max(w, t.length), 5)
for (const title of titles) {
  const family = matchFamily(title)
  console.log(`${title.padEnd(width)}  ${family ? family.name : 'UNMATCHED'}`)
}

import fs from 'node:fs'
import path from 'node:path'

const cwd = process.cwd()
const envPath = path.join(cwd, '.env')

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const raw = fs.readFileSync(filePath, 'utf8')
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

const fileEnv = parseEnvFile(envPath)
const readVar = (key) => process.env[key] ?? fileEnv[key] ?? ''
const has = (key) => Boolean(readVar(key).trim())

const required = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'FLOOZ_API_URL',
  'FLOOZ_API_TOKEN',
  'TMONEY_API_URL',
  'TMONEY_API_TOKEN',
  'PAYMENT_WEBHOOK_SECRET',
  'BLOB_READ_WRITE_TOKEN',
]

const recommended = [
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'WHATSAPP_API_URL',
  'WHATSAPP_API_TOKEN',
  'PUSHER_APP_ID',
  'PUSHER_KEY',
  'PUSHER_SECRET',
  'PUSHER_CLUSTER',
  'NEXT_PUBLIC_PUSHER_KEY',
  'NEXT_PUBLIC_PUSHER_CLUSTER',
]

const missingRequired = required.filter((k) => !has(k))
const missingRecommended = recommended.filter((k) => !has(k))

function printSection(title, items, okLabel, missingLabel) {
  console.log(`\n${title}`)
  if (items.length === 0) {
    console.log(`  ${okLabel}`)
    return
  }
  console.log(`  ${missingLabel}`)
  for (const item of items) console.log(`  - ${item}`)
}

console.log('Execly v2 preflight')
console.log(`.env file: ${fs.existsSync(envPath) ? 'found' : 'not found'}`)

printSection('Required variables', missingRequired, 'OK', 'Missing:')
printSection('Recommended variables', missingRecommended, 'All set', 'Missing (optional):')

const pusherServerSet = ['PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET', 'PUSHER_CLUSTER'].every(has)
const pusherClientSet = ['NEXT_PUBLIC_PUSHER_KEY', 'NEXT_PUBLIC_PUSHER_CLUSTER'].every(has)
if (pusherServerSet !== pusherClientSet) {
  console.log('\nPusher consistency')
  console.log('  Server/client config mismatch. Set both sides together.')
}

if (missingRequired.length > 0) {
  console.log('\nPreflight failed.')
  process.exit(1)
}

console.log('\nPreflight passed.')

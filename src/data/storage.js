import {
  readBooks as staticReadBooks,
  seriesByNormalizedTitle,
  tbrBooks as staticTbrBooks,
} from './books.js'

const READ_KEY = 'readingTracker.readBooks.v1'
const TBR_KEY = 'readingTracker.tbrBooks.v1'
const TBR_STATIC_VERSION_KEY = 'readingTracker.tbrStaticVersion.v1'
const READ_STATIC_VERSION_KEY = 'readingTracker.readStaticVersion.v1'

// Legacy keys from earlier iterations of this app
const LEGACY_ADDED_READ_KEY = 'readingTracker.addedBooks.v1'
const LEGACY_TBR_KEY = 'readingTracker.tbrBooks.v1'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', 'Previous Years']

/**
 * Renames stored series strings for titles *not* in the static TBR catalog (or legacy
 * labels that no longer match static). Catalog titles get series from `books.js` automatically.
 */
const TBR_SERIES_RENAMES = {
  'A Betrayal of Storms': 'Realm of Fey',
  'A Curse So Dark and Lonely': 'Cursebreaker',
  'And I Darken': "The Conqueror's Saga",
  "Assassin's Blade": 'Throne of Glass',
  'Bone Crier': 'Bone Grace',
  'Chloe Walsh': 'Boys of Tommen',
  'God of': 'Legacy of Gods',
  'Good Game': 'The System',
  'The Shadows Between Us': 'The Stathos Sisters',
}

function renameTbrSeriesLabel(series) {
  if (!series || typeof series !== 'string') return null
  return TBR_SERIES_RENAMES[series] ?? series
}

/** Series from static TBR list (after legacy renames), keyed by normalized title */
function buildStaticTbrSeriesByTitle() {
  return new Map(
    staticTbrBooks.map((b) => [normalizeTitleKey(b.title), renameTbrSeriesLabel(b.series ?? null)]),
  )
}

/** Static catalog wins for known titles; otherwise use stored series + renames */
function resolveTbrSeriesForTitle(staticMap, title, storedSeries) {
  const key = normalizeTitleKey(title)
  if (staticMap.has(key)) return staticMap.get(key)
  return renameTbrSeriesLabel(storedSeries ?? null)
}

function safeParseJson(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function hashString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return String(hash)
}

function getStaticReadVersion() {
  const payload = YEAR_OPTIONS
    .map((y) => `${y}::${(staticReadBooks[y] ?? []).join('|')}`)
    .join('||')
  return `${YEAR_OPTIONS.length}:${hashString(payload)}`
}

function getStaticTbrVersion() {
  // Stable-ish fingerprint of the static list (titles+series).
  const payload = staticTbrBooks.map((b) => `${b.title}::${b.series ?? ''}`).join('|')
  return `${staticTbrBooks.length}:${hashString(payload)}`
}

function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

// Stored read-books title renames (fixes old localStorage values)
const READ_TITLE_RENAMES = {
  'hunger games': 'The Hunger Games',
}

function renameReadTitle(title) {
  const trimmed = typeof title === 'string' ? title.trim() : ''
  if (!trimmed) return ''
  return READ_TITLE_RENAMES[normalizeTitleKey(trimmed)] ?? trimmed
}

function dedupeStrings(items) {
  const seen = new Set()
  const out = []
  for (const raw of items) {
    if (typeof raw !== 'string') continue
    const t = renameReadTitle(raw)
    const key = normalizeTitleKey(t)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

function normalizeReadBooks(raw) {
  const out = {}
  for (const year of YEAR_OPTIONS) out[year] = []

  if (!raw || typeof raw !== 'object') return out

  for (const year of YEAR_OPTIONS) {
    const items = raw[year]
    if (Array.isArray(items)) out[year] = dedupeStrings(items)
  }

  return out
}

function mergeReadBooks(base, extra) {
  const merged = {}
  for (const year of YEAR_OPTIONS) {
    const a = Array.isArray(base?.[year]) ? base[year] : []
    const b = Array.isArray(extra?.[year]) ? extra[year] : []
    merged[year] = dedupeStrings([...a, ...b])
  }
  return merged
}

function normalizeTbrBooks(raw) {
  const arr = Array.isArray(raw) ? raw : null
  const items = []

  if (arr) {
    // Backward compat: ["Title", ...]
    if (arr.length > 0 && typeof arr[0] === 'string') {
      const fallbackSeriesByTitle = new Map(
        staticTbrBooks.map((b) => [normalizeTitleKey(b.title), b.series ?? null]),
      )
      for (const t of arr) {
        if (typeof t !== 'string') continue
        const title = t.trim()
        if (!title) continue
        items.push({
          title,
          series: fallbackSeriesByTitle.get(normalizeTitleKey(title)) ?? null,
        })
      }
    } else {
      for (const b of arr) {
        if (!b || typeof b !== 'object') continue
        const title = typeof b.title === 'string' ? b.title.trim() : ''
        if (!title) continue
        items.push({
          title,
          series: typeof b.series === 'string' ? b.series : null,
        })
      }
    }
  } else {
    items.push(...staticTbrBooks)
  }

  const staticSeriesMap = buildStaticTbrSeriesByTitle()
  const seen = new Set()
  const out = []
  for (const b of items) {
    const key = normalizeTitleKey(b.title)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push({
      title: b.title,
      series: resolveTbrSeriesForTitle(staticSeriesMap, b.title, b.series ?? null),
    })
  }
  return out
}

function emitChange() {
  window.dispatchEvent(new Event('readingTracker:storage'))
}

function syncTbrWithStaticIfNeeded(currentTbr) {
  const currentVersion = localStorage.getItem(TBR_STATIC_VERSION_KEY)
  const staticVersion = getStaticTbrVersion()
  if (currentVersion === staticVersion) return currentTbr

  // Add any *new* static titles that aren't in the user's stored list yet.
  const existing = new Set(currentTbr.map((b) => normalizeTitleKey(b.title)))
  const merged = [...currentTbr]
  for (const b of staticTbrBooks) {
    const key = normalizeTitleKey(b.title)
    if (!key || existing.has(key)) continue
    merged.push({ title: b.title, series: renameTbrSeriesLabel(b.series ?? null) })
  }

  const staticSeriesMap = buildStaticTbrSeriesByTitle()
  const normalized = merged.map((b) => ({
    ...b,
    series: resolveTbrSeriesForTitle(staticSeriesMap, b.title, b.series ?? null),
  }))

  localStorage.setItem(TBR_STATIC_VERSION_KEY, staticVersion)
  localStorage.setItem(TBR_KEY, JSON.stringify(normalizeTbrBooks(normalized)))
  emitChange()
  return normalizeTbrBooks(normalized)
}

function migrateIfNeeded() {
  // Seed read books if missing (and migrate legacy "addedBooks" if present)
  if (!localStorage.getItem(READ_KEY)) {
    const legacyAdded = safeParseJson(localStorage.getItem(LEGACY_ADDED_READ_KEY))
    const seeded = mergeReadBooks(staticReadBooks, normalizeReadBooks(legacyAdded))
    localStorage.setItem(READ_KEY, JSON.stringify(seeded))
    localStorage.setItem(READ_STATIC_VERSION_KEY, getStaticReadVersion())
  }

  // Seed tbr if missing (and migrate legacy formats if present)
  if (!localStorage.getItem(TBR_KEY)) {
    const legacyTbr = safeParseJson(localStorage.getItem(LEGACY_TBR_KEY))
    const seeded = normalizeTbrBooks(legacyTbr ?? staticTbrBooks)
    localStorage.setItem(TBR_KEY, JSON.stringify(seeded))
    localStorage.setItem(TBR_STATIC_VERSION_KEY, getStaticTbrVersion())
  }
}

function syncReadWithStaticIfNeeded(currentRead) {
  const currentVersion = localStorage.getItem(READ_STATIC_VERSION_KEY)
  const staticVersion = getStaticReadVersion()
  if (currentVersion === staticVersion) return currentRead

  // Merge in any new/changed static titles, plus apply rename rules.
  const merged = mergeReadBooks(staticReadBooks, currentRead)
  const normalized = normalizeReadBooks(merged)

  localStorage.setItem(READ_STATIC_VERSION_KEY, staticVersion)
  localStorage.setItem(READ_KEY, JSON.stringify(normalized))
  emitChange()
  return normalized
}

export function getReadBooks() {
  migrateIfNeeded()
  const raw = safeParseJson(localStorage.getItem(READ_KEY))
  const normalized = normalizeReadBooks(raw)
  return syncReadWithStaticIfNeeded(normalized)
}

export function saveReadBooks(data) {
  localStorage.setItem(READ_KEY, JSON.stringify(normalizeReadBooks(data)))
  emitChange()
}

export function getTBRBooks() {
  migrateIfNeeded()
  const raw = safeParseJson(localStorage.getItem(TBR_KEY))
  const normalized = normalizeTbrBooks(raw)
  return syncTbrWithStaticIfNeeded(normalized)
}

export function saveTBRBooks(data) {
  localStorage.setItem(TBR_KEY, JSON.stringify(normalizeTbrBooks(data)))
  emitChange()
}

export function inferTbrSeries(title) {
  const key = normalizeTitleKey(title)
  if (!key) return null
  if (Object.prototype.hasOwnProperty.call(seriesByNormalizedTitle, key)) {
    return seriesByNormalizedTitle[key]
  }
  const hit = staticTbrBooks.find((b) => normalizeTitleKey(b.title) === key)
  return hit?.series ?? null
}


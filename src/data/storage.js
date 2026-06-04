import { supabase } from './supabase.js'
import {
  readBooks as staticReadBooks,
  tbrBooks as staticTbrBooks,
  seriesByNormalizedTitle,
} from './books.js'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', 'Previous Years']

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

function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

const READ_TITLE_RENAMES = {
  'hunger games': 'The Hunger Games',
}

function renameReadTitle(title) {
  const trimmed = typeof title === 'string' ? title.trim() : ''
  if (!trimmed) return ''
  return READ_TITLE_RENAMES[normalizeTitleKey(trimmed)] ?? trimmed
}

function buildStaticTbrSeriesByTitle() {
  return new Map(
    staticTbrBooks.map((b) => [
      normalizeTitleKey(b.title),
      renameTbrSeriesLabel(b.series ?? null),
    ]),
  )
}

function resolveTbrSeriesForTitle(staticMap, title, storedSeries) {
  const key = normalizeTitleKey(title)
  if (staticMap.has(key)) return staticMap.get(key)
  return renameTbrSeriesLabel(storedSeries ?? null)
}

function emitChange() {
  window.dispatchEvent(new Event('readingTracker:storage'))
}

// ─── Supabase seeders ────────────────────────────────────────────────────────

async function seedReadBooksIfEmpty() {
  const { count } = await supabase
    .from('read_books')
    .select('*', { count: 'exact', head: true })

  if (count > 0) return // already seeded

  const rows = []
  for (const year of YEAR_OPTIONS) {
    const titles = staticReadBooks[year] ?? []
    for (const title of titles) {
      rows.push({ year, title: renameReadTitle(title) })
    }
  }
  if (rows.length > 0) {
    await supabase.from('read_books').insert(rows)
  }
}

async function seedTbrBooksIfEmpty() {
  const { count } = await supabase
    .from('tbr_books')
    .select('*', { count: 'exact', head: true })

  if (count > 0) return // already seeded

  const staticSeriesMap = buildStaticTbrSeriesByTitle()
  const rows = staticTbrBooks.map((b) => ({
    title: b.title,
    series: resolveTbrSeriesForTitle(staticSeriesMap, b.title, b.series ?? null),
  }))
  if (rows.length > 0) {
    await supabase.from('tbr_books').insert(rows)
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getReadBooks() {
  await seedReadBooksIfEmpty()

  const { data, error } = await supabase
    .from('read_books')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getReadBooks error:', error)
    return Object.fromEntries(YEAR_OPTIONS.map((y) => [y, []]))
  }

  const out = Object.fromEntries(YEAR_OPTIONS.map((y) => [y, []]))
  for (const row of data) {
    if (out[row.year]) out[row.year].push(row.title)
  }
  return out
}

export async function saveReadBooks(data) {
  // Replace all read_books rows with the new data
  await supabase.from('read_books').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const rows = []
  for (const year of YEAR_OPTIONS) {
    const titles = data[year] ?? []
    for (const title of titles) {
      rows.push({ year, title })
    }
  }
  if (rows.length > 0) {
    await supabase.from('read_books').insert(rows)
  }
  emitChange()
}

export async function getTBRBooks() {
  await seedTbrBooksIfEmpty()

  const { data, error } = await supabase
    .from('tbr_books')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getTBRBooks error:', error)
    return []
  }

  const staticSeriesMap = buildStaticTbrSeriesByTitle()
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    series: resolveTbrSeriesForTitle(staticSeriesMap, row.title, row.series ?? null),
  }))
}

export async function saveTBRBooks(data) {
  // Replace all tbr_books rows with the new data
  await supabase.from('tbr_books').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const staticSeriesMap = buildStaticTbrSeriesByTitle()
  const rows = data.map((b) => ({
    title: b.title,
    series: resolveTbrSeriesForTitle(staticSeriesMap, b.title, b.series ?? null),
  }))
  if (rows.length > 0) {
    await supabase.from('tbr_books').insert(rows)
  }
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
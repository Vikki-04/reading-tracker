import { useEffect, useMemo, useState } from 'react'

import { getReadBooks, getTBRBooks, inferTbrSeries, saveReadBooks, saveTBRBooks } from '../data/storage.js'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', 'Previous Years']

function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

const PAGE_DEFAULT_BG =
  'radial-gradient(1100px 500px at 20% 0%, rgba(84, 58, 183, 0.18), transparent 55%), radial-gradient(900px 450px at 80% 10%, rgba(26, 27, 75, 0.16), transparent 52%), #f6f5ff'

/**
 * Reading Log background: must be a WEB path starting with `/`, not a Windows path.
 * Put the image file inside the `public` folder next to `favicon.svg`, then set the
 * path here to `/` + filename (e.g. file `public/library-bg.jpg` → `'/library-bg.jpg'`).
 * Use '' for no photo (purple gradient only).
 */
const READING_LOG_BACKGROUND_SRC = '/trial.jpg'

/** Photo darkness: lower = darker image (0.55–1). Only affects the picture layer. */
const READING_LOG_BG_BRIGHTNESS = 0.75


/**
 * Default font for Reading Log copy. Applied on `pageContent` (inherits to headings, etc.)
 * and on form controls (inputs don’t always inherit in every browser).
 * Change size/color per element in `styles` below — see TYPOGRAPHY MAP comment inside `styles`.
 */
const READING_LOG_FONT_FAMILY = '"Times New Roman", Times, serif'

/** Search field: max width in px (bar grows with page up to this). */
const READING_LOG_SEARCH_MAX_WIDTH_PX = 500

const styles = {
  /* TYPOGRAPHY MAP — edit `fontSize`, `color`, `fontWeight`, `fontFamily` in each block:
   *   pageHeader   → centers the header stack (title, count, subtitle); layout only
   *   title        → “Reading Log” (main H1)
   *   total        → “✅ N books read”
   *   subtitle     → “Track what you’ve finished…”
   *   input        → typed text in title box + search box (same style)
   *   select       → year dropdown text
   *   button       → “Add Book” label
   *   yearTitle    → year headings (2026, 2025, …)
   *   yearCount    → “N books” next to year
   *   bookTitle    → each book name in the grid
   *   empty        → “No books yet.” / search empty messages
   *   backBtn / deleteBtn → icon buttons (color, size via width/height + lineHeight)
   * Page-level font: `pageContent` has fontFamily (inherits). Override any block with its own fontFamily.
   */
  pageShell: {
    minHeight: 'calc(100vh - 64px)',
    position: 'relative',
    borderRadius: 18,
    border: '1px solid rgba(26, 27, 75, 0.08)',
    overflow: 'hidden',
    isolation: 'isolate',
    width: '100%',
  },
  pageBgImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    pointerEvents: 'none',
    filter: `brightness(${READING_LOG_BG_BRIGHTNESS})`,
    zIndex: 0,
    userSelect: 'none',
  },
  // Softer wash = photo reads stronger. Raise alphas (e.g. 0.55 → 0.75) if text feels hard to read.
  pageBgOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
    background:
      'radial-gradient(1100px 500px at 20% 0%, rgba(246, 245, 255, 0.10), transparent 55%), radial-gradient(900px 450px at 80% 10%, rgba(246, 245, 255, 0.10), transparent 52%), rgba(246, 245, 255, 0.10)',
  },
  pageContent: {
    position: 'relative',
    zIndex: 2,
    padding: 18,
    fontFamily: READING_LOG_FONT_FAMILY,
    fontSize: 16,
    color: '#1a1b4b',
  },
  title: {
    margin: 0,
    fontSize: 40,
    color: '#ebdecc',
    letterSpacing: '-0.02em',
    justifySelf: 'center',
    transform: 'translateY(8px)',
    fontFamily: READING_LOG_FONT_FAMILY,
    /*textShadow: '0 0 24px rgba(250, 250, 250, 0.14), 0 1px 2px rgba(255,255,255,0.9)',*/
  },
  /** Title row: equal side columns so the title stays visually centered; total aligns right. */
  titleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    width: '100%',
    columnGap: 12,
  },
  titleRowSpacer: {
    minHeight: 1,
    minWidth: 0,
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  total: {
    margin: 0,
    color: '#ebdecc',
    fontWeight: 800,
    justifySelf: 'end',
    textAlign: 'right',
    fontSize: 20,
    /*textShadow: '0 0 18px rgba(255,255,255,0.95)',*/
  },
  subtitle: {
    margin: '8px 0 0',
    color: '#ebdecc',
    fontWeight: 800,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 640,
    transform: 'translateY(15px)',
    fontSize: 20,
    /*textShadow: '0 0 16px rgba(255,255,255,0.92)',*/
  },
  /** Add book / search: no outer panel—controls sit on the page background. */
  formStrip: {
    marginTop: 18,
    padding: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    transform: 'translateY(20px)'
  },
  formStripSearch: {
    marginTop: 12,
    padding: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    transform: 'translateY(15px)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 200px 140px',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    maxWidth: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(26, 27, 75, 0.18)',
    outline: 'none',
    fontSize: 14,
    fontFamily: READING_LOG_FONT_FAMILY,
    background: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(8px)',
    color: '#1a1b4b',
  },
  /** Search-only: width cap (see READING_LOG_SEARCH_MAX_WIDTH_PX at top of file). */
  searchInput: {
    maxWidth: READING_LOG_SEARCH_MAX_WIDTH_PX,
    display: 'block',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(26, 27, 75, 0.18)',
    outline: 'none',
    fontSize: 14,
    fontFamily: READING_LOG_FONT_FAMILY,
    background: '#a18770',
    backdropFilter: 'blur(8px)',
    color: '#fcfaf7',
  },
  button: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.18)',
    background: '#a18770',
    color: '#fff',
    fontWeight: 750,
    fontSize: 14,
    fontFamily: READING_LOG_FONT_FAMILY,
    cursor: 'pointer',
  },
  sections: { marginTop: 18, display: 'grid', gap: 20 },
  /** Year group: no panel—book tiles sit on the page background. */
  yearSection: {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    overflow: 'visible',
  },
  yearHeadingRow: {
    padding: '4px 0 10px',
    marginBottom: 2,
    borderBottom: '1px solid rgba(26, 27, 75, 0.14)',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  yearTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 1000,
    color: '#523f26',
    textShadow: '0 0 18px rgba(255,255,255,0.9), 0 1px 2px rgba(255, 255, 255, 0.5)',
    transform: 'translateY(10px)',
    fontFamily: READING_LOG_FONT_FAMILY,
  },
  yearCount: {
    margin: 0,
    color: '#fcfaf7',
    fontWeight: 700,
    textShadow: '0 0 14px rgba(255,255,255,0.9)',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: '10px 0 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 10,
  },
  bookItem: {
    display: 'grid',
    gridTemplateColumns: '20px 1fr 28px 28px',
    alignItems: 'start',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 14,
    background: '#a18770',
    border: '1px solid rgba(26, 27, 75, 0.10)',
    backdropFilter: 'blur(6px)',
  },
  bookEmoji: { lineHeight: '20px' },
  bookTitle: { margin: 0, color: '#fcfaf7', fontWeight: 700, fontSize: 18 },
  deleteBtn: {
    width: 24,
    height: 24,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 8,
    border: '1px solid rgba(26, 27, 75, 0.14)',
    background: 'rgba(255,255,255,0.65)',
    color: 'rgba(26, 27, 75, 0.85)',
    cursor: 'pointer',
    fontWeight: 900,
    lineHeight: '20px',
  },
  backBtn: {
    width: 24,
    height: 24,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 8,
    border: '1px solid rgba(26, 27, 75, 0.14)',
    background: 'rgba(255,255,255,0.65)',
    color: 'rgba(26, 27, 75, 0.85)',
    cursor: 'pointer',
    fontWeight: 900,
    lineHeight: '20px',
  },
  empty: {
    padding: '12px 0 4px',
    color: 'rgba(26, 27, 75, 0.82)',
    textShadow: '0 0 14px rgba(255,255,255,0.88)',
  },
}

function readLogBookMatchesQuery(bookTitle, q) {
  if (!q) return true
  if (bookTitle.toLowerCase().includes(q)) return true
  const series = inferTbrSeries(bookTitle)
  return typeof series === 'string' && series.toLowerCase().includes(q)
}

export function ReadingLog() {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('2026')
  const [logQuery, setLogQuery] = useState('')
  const [readByYear, setReadByYear] = useState(() => getReadBooks())

  useEffect(() => {
    const onChange = () => setReadByYear(getReadBooks())
    window.addEventListener('readingTracker:storage', onChange)
    return () => window.removeEventListener('readingTracker:storage', onChange)
  }, [])

  const mergedByYear = useMemo(() => readByYear, [readByYear])
  const logQ = logQuery.trim().toLowerCase()
  const filteredByYear = useMemo(() => {
    if (!logQ) return mergedByYear
    const out = {}
    for (const y of YEAR_OPTIONS) {
      const books = mergedByYear[y] ?? []
      out[y] = books.filter((t) => readLogBookMatchesQuery(t, logQ))
    }
    return out
  }, [mergedByYear, logQ])

  const totalRead = useMemo(
    () => YEAR_OPTIONS.reduce((sum, y) => sum + (mergedByYear[y]?.length ?? 0), 0),
    [mergedByYear],
  )

  function onSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const nextYearList = readByYear[year] ?? []
    const exists = nextYearList.some((t) => normalizeTitleKey(t) === normalizeTitleKey(trimmed))
    if (exists) {
      setTitle('')
      return
    }

    const next = { ...readByYear, [year]: [...nextYearList, trimmed] }
    setReadByYear(next)
    saveReadBooks(next)

    setTitle('')
  }

  function onDeleteBook(yearKey, bookTitle) {
    const current = readByYear[yearKey] ?? []
    const nextList = current.filter((t) => normalizeTitleKey(t) !== normalizeTitleKey(bookTitle))
    const next = { ...readByYear, [yearKey]: nextList }
    setReadByYear(next)
    saveReadBooks(next)
  }

  function onMoveBackToTbr(yearKey, bookTitle) {
    // Remove from read list
    const current = readByYear[yearKey] ?? []
    const nextList = current.filter((t) => normalizeTitleKey(t) !== normalizeTitleKey(bookTitle))
    const nextRead = { ...readByYear, [yearKey]: nextList }
    setReadByYear(nextRead)
    saveReadBooks(nextRead)

    // Add back to TBR (if not already there)
    const currentTbr = getTBRBooks()
    const exists = currentTbr.some((b) => normalizeTitleKey(b.title) === normalizeTitleKey(bookTitle))
    if (!exists) {
      const nextTbr = [...currentTbr, { title: bookTitle, series: inferTbrSeries(bookTitle) }]
      saveTBRBooks(nextTbr)
    }
  }

  const showPhotoBg = READING_LOG_BACKGROUND_SRC.length > 0

  /** Base gradient under the photo layer avoids a transparent first paint while `background-image` loads. */
  const pageShellStyle = {
    ...styles.pageShell,
    background: PAGE_DEFAULT_BG,
  }

  return (
    <div style={pageShellStyle}>
      {showPhotoBg ? (
        <>
          <img
            src={READING_LOG_BACKGROUND_SRC}
            alt=""
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
            draggable={false}
            style={styles.pageBgImg}
            aria-hidden
          />
          <div style={styles.pageBgOverlay} aria-hidden />
        </>
      ) : null}

      <div style={styles.pageContent}>
        <header style={styles.pageHeader}>
          <div style={styles.titleRow}>
            <div style={styles.titleRowSpacer} aria-hidden="true" />
            <h1 style={styles.title}>Reading Log</h1>
            <p style={styles.total}>
              ✅ {totalRead} {totalRead === 1 ? 'book' : 'books'} read
            </p>
          </div>
          <p style={styles.subtitle}>Track what you’ve finished, grouped by year.</p>
        </header>

      <section style={styles.formStrip} aria-label="Add a book">
        <form onSubmit={onSubmit}>
          <div style={styles.formRow}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a book title…"
              aria-label="Book title"
              style={styles.input}
            />

            <select value={year} onChange={(e) => setYear(e.target.value)} style={styles.select}>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button type="submit" style={styles.button}>
              Add Book
            </button>
          </div>
        </form>
      </section>

      <section style={styles.formStripSearch} aria-label="Search reading log">
        <input
          value={logQuery}
          onChange={(e) => setLogQuery(e.target.value)}
          placeholder="Search by title or series…"
          aria-label="Search reading log"
          style={{ ...styles.input, ...styles.searchInput }}
        />
      </section>

      <section style={styles.sections} aria-label="Books by year">
        {YEAR_OPTIONS.map((y) => {
          const books = filteredByYear[y] ?? []
          const count = books.length
          const label = `${y} — ${count} ${count === 1 ? 'book' : 'books'}`

          return (
            <section key={y} style={styles.yearSection} aria-label={label}>
              <div style={styles.yearHeadingRow}>
                <h2 style={styles.yearTitle}>{y}</h2>
                <p style={styles.yearCount}>
                  {count} {count === 1 ? 'book' : 'books'}
                </p>
              </div>

              {count === 0 ? (
                <div style={styles.empty}>
                  {(mergedByYear[y]?.length ?? 0) === 0
                    ? 'No books yet.'
                    : 'No books match your search.'}
                </div>
              ) : (
                <ul style={styles.list}>
                  {books.map((book) => (
                    <li key={`${y}:${book}`} style={styles.bookItem}>
                      <span style={styles.bookEmoji} aria-hidden="true">
                        📖
                      </span>
                      <p style={styles.bookTitle}>{book}</p>
                      <button
                        type="button"
                        onClick={() => onMoveBackToTbr(y, book)}
                        aria-label={`Move "${book}" back to TBR`}
                        title="Move back to TBR"
                        style={styles.backBtn}
                      >
                        ↩
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteBook(y, book)}
                        aria-label={`Delete "${book}" from ${y}`}
                        title="Delete"
                        style={styles.deleteBtn}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </section>
      </div>
    </div>
  )
}


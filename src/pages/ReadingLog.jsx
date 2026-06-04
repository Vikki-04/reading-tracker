import { useEffect, useMemo, useState } from 'react'

import { getReadBooks, getTBRBooks, inferTbrSeries, saveReadBooks, saveTBRBooks } from '../data/storage.js'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', 'Previous Years']

function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

const PAGE_DEFAULT_BG =
  'radial-gradient(1100px 500px at 20% 0%, rgba(84, 58, 183, 0.18), transparent 55%), radial-gradient(900px 450px at 80% 10%, rgba(26, 27, 75, 0.16), transparent 52%), #f6f5ff'

const READING_LOG_BACKGROUND_SRC = '/trial.jpg'
const READING_LOG_BG_BRIGHTNESS = 0.75
const READING_LOG_FONT_FAMILY = '"Times New Roman", Times, serif'

const styles = {
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
  },
  titleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    width: '100%',
    columnGap: 12,
  },
  titleRowSpacer: { minHeight: 1, minWidth: 0 },
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
  },
  formStrip: {
    marginTop: 18,
    padding: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    transform: 'translateY(20px)',
  },
  formStripSearch: {
    marginTop: 12,
    padding: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    transform: 'translateY(15px)',
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
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
  },
  sections: { marginTop: 18, display: 'grid', gap: 20 },
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
  loading: {
    padding: '40px 0',
    textAlign: 'center',
    color: '#ebdecc',
    fontSize: 18,
    fontFamily: READING_LOG_FONT_FAMILY,
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
  const [readByYear, setReadByYear] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReadBooks().then((data) => {
      setReadByYear(data)
      setLoading(false)
    })

    const onChange = () => {
      getReadBooks().then(setReadByYear)
    }
    window.addEventListener('readingTracker:storage', onChange)
    return () => window.removeEventListener('readingTracker:storage', onChange)
  }, [])

  const mergedByYear = useMemo(
    () => readByYear ?? Object.fromEntries(YEAR_OPTIONS.map((y) => [y, []])),
    [readByYear],
  )

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

  async function onSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const nextYearList = readByYear[year] ?? []
    const exists = nextYearList.some((t) => normalizeTitleKey(t) === normalizeTitleKey(trimmed))
    if (exists) { setTitle(''); return }
    const next = { ...readByYear, [year]: [...nextYearList, trimmed] }
    setReadByYear(next)
    await saveReadBooks(next)
    setTitle('')
  }

  async function onDeleteBook(yearKey, bookTitle) {
    const current = readByYear[yearKey] ?? []
    const nextList = current.filter((t) => normalizeTitleKey(t) !== normalizeTitleKey(bookTitle))
    const next = { ...readByYear, [yearKey]: nextList }
    setReadByYear(next)
    await saveReadBooks(next)
  }

  async function onMoveBackToTbr(yearKey, bookTitle) {
    const current = readByYear[yearKey] ?? []
    const nextList = current.filter((t) => normalizeTitleKey(t) !== normalizeTitleKey(bookTitle))
    const nextRead = { ...readByYear, [yearKey]: nextList }
    setReadByYear(nextRead)
    await saveReadBooks(nextRead)
    const currentTbr = await getTBRBooks()
    const exists = currentTbr.some((b) => normalizeTitleKey(b.title) === normalizeTitleKey(bookTitle))
    if (!exists) {
      const nextTbr = [...currentTbr, { title: bookTitle, series: inferTbrSeries(bookTitle) }]
      await saveTBRBooks(nextTbr)
    }
  }

  const showPhotoBg = READING_LOG_BACKGROUND_SRC.length > 0
  const pageShellStyle = { ...styles.pageShell, background: PAGE_DEFAULT_BG }

  return (
    <div style={pageShellStyle}>
      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .rl-title { font-size: 28px !important; }
          .rl-total { font-size: 15px !important; }
          .rl-subtitle { font-size: 15px !important; }
          .rl-form-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .rl-form-row input {
            grid-column: 1 / -1 !important;
          }
          .rl-search {
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .rl-list {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

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
            <h1 style={styles.title} className="rl-title">Reading Log</h1>
            <p style={styles.total} className="rl-total">
              ✅ {totalRead} {totalRead === 1 ? 'book' : 'books'} read
            </p>
          </div>
          <p style={styles.subtitle} className="rl-subtitle">
            Track what you've finished, grouped by year.
          </p>
        </header>

        <section style={styles.formStrip} aria-label="Add a book">
          <form onSubmit={onSubmit}>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 200px 140px', gap: 10, alignItems: 'center' }}
              className="rl-form-row"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a book title…"
                aria-label="Book title"
                style={styles.input}
              />
              <select value={year} onChange={(e) => setYear(e.target.value)} style={styles.select}>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button type="submit" style={styles.button}>Add Book</button>
            </div>
          </form>
        </section>

        <section style={styles.formStripSearch} aria-label="Search reading log">
          <input
            value={logQuery}
            onChange={(e) => setLogQuery(e.target.value)}
            placeholder="Search by title or series…"
            aria-label="Search reading log"
            style={{ ...styles.input, maxWidth: 500, display: 'block' }}
            className="rl-search"
          />
        </section>

        {loading ? (
          <div style={styles.loading}>Loading your books…</div>
        ) : (
          <section style={styles.sections} aria-label="Books by year">
            {YEAR_OPTIONS.map((y) => {
              const books = filteredByYear[y] ?? []
              const count = books.length
              return (
                <section key={y} style={styles.yearSection} aria-label={`${y} books`}>
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
                    <ul style={styles.list} className="rl-list">
                      {books.map((book) => (
                        <li key={`${y}:${book}`} style={styles.bookItem}>
                          <span style={styles.bookEmoji} aria-hidden="true">📖</span>
                          <p style={styles.bookTitle}>{book}</p>
                          <button
                            type="button"
                            onClick={() => onMoveBackToTbr(y, book)}
                            aria-label={`Move "${book}" back to TBR`}
                            title="Move back to TBR"
                            style={styles.backBtn}
                          >↩</button>
                          <button
                            type="button"
                            onClick={() => onDeleteBook(y, book)}
                            aria-label={`Delete "${book}" from ${y}`}
                            title="Delete"
                            style={styles.deleteBtn}
                          >✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </section>
        )}
      </div>
    </div>
  )
}
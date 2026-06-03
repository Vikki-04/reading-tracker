import { useEffect, useMemo, useState } from 'react'

import { getReadBooks, getTBRBooks, saveReadBooks, saveTBRBooks } from '../data/storage.js'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', 'Previous Years']

/** Collapse state key for standalone TBR books (not a real series name). */
const STANDALONE_TBR_KEY = '__reading_tracker_standalone__'

const PAGE_DEFAULT_BG =
  'radial-gradient(1100px 500px at 20% 0%, rgba(84, 58, 183, 0.18), transparent 55%), radial-gradient(900px 450px at 80% 10%, rgba(26, 27, 75, 0.16), transparent 52%), #f6f5ff'

/**
 * Reading Log background: must be a WEB path starting with `/`, not a Windows path.
 * Put the image file inside the `public` folder next to `favicon.svg`, then set the
 * path here to `/` + filename (e.g. file `public/library-bg.jpg` → `'/library-bg.jpg'`).
 * Use '' for no photo (purple gradient only).
 */
const TBR_LIST_BACKGROUND_SRC = '/dark_trial.jpg'

/** Photo darkness: lower = darker image (0.55–1). Only affects the picture layer. */
const TBR_LIST_BG_BRIGHTNESS = 0.75

const TBR_LIST_FONT_FAMILY = '"Times New Roman", Times, serif'

/** Search field: max width in px (bar grows with page up to this). */
const TBR_LIST_SEARCH_MAX_WIDTH_PX = 600


function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

function dedupeTbr(items) {
  const seen = new Set()
  const out = []
  for (const b of items) {
    const key = normalizeTitleKey(b.title)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push({ title: b.title, series: b.series ?? null })
  }
  return out
}

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
    filter: `brightness(${TBR_LIST_BG_BRIGHTNESS})`,
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
    minHeight: 'calc(100vh - 64px)',
    padding: 18,
    fontFamily: TBR_LIST_FONT_FAMILY,
    fontSize: 16,
    color: '#1a1b4b',
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  titleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    width: '100%',
    columnGap: 12,
  },
  titleRowSpacer: { minHeight: 1, minWidth: 0 },
  title: {
    margin: 0,
    fontSize: 40,
    color: '#ebdecc',
    letterSpacing: '-0.02em',
    justifySelf: 'center',
    transform: 'translateY(8px)',
    fontFamily: TBR_LIST_FONT_FAMILY,
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 140px',
    gap: 10,
    alignItems: 'center',
  },
  addSeriesRow: { gridColumn: '1 / -1', marginTop: 10 },
  input: {
    width: '100%',
    maxWidth: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(26, 27, 75, 0.18)',
    outline: 'none',
    fontSize: 14,
    fontFamily: TBR_LIST_FONT_FAMILY,
    background: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(8px)',
    color: '#1a1b4b',
  },
  searchInput: {
    maxWidth: TBR_LIST_SEARCH_MAX_WIDTH_PX,
    display: 'block',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(26, 27, 75, 0.18)',
    outline: 'none',
    fontSize: 14,
    fontFamily: TBR_LIST_FONT_FAMILY,
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
    fontFamily: TBR_LIST_FONT_FAMILY,
    cursor: 'pointer',
  },
  buttonGhost: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'transparent',
    color: '#fcfaf7',
    fontWeight: 750,
    fontSize: 14,
    fontFamily: TBR_LIST_FONT_FAMILY,
    cursor: 'pointer',
  },
  sections: { marginTop: 18, display: 'grid', gap: 20 },
  seriesSection: {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    overflow: 'visible',
  },
  seriesHeadingRow: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    marginBottom: 0,
    border: '1px solid rgba(26, 27, 75, 0.10)',
    borderRadius: 14,
    background: '#a18770',
    backdropFilter: 'blur(6px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  seriesTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 1000,
    color: '#fcfaf7',
    fontFamily: TBR_LIST_FONT_FAMILY,
  },
  seriesCount: {
    margin: 0,
    color: '#fcfaf7',
    fontWeight: 700,
    opacity: 0.92,
    fontFamily: TBR_LIST_FONT_FAMILY,
    fontSize: 17,
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
    gridTemplateColumns: '28px 1fr 28px',
    alignItems: 'start',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 14,
    background: '#a18770',
    border: '1px solid rgba(26, 27, 75, 0.10)',
    backdropFilter: 'blur(6px)',
  },
  bookTitle: { margin: 0, color: '#fcfaf7', fontWeight: 700, fontSize: 17 },
  finishPrompt: {
    marginTop: 8,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.18)',
  },
  promptLabel: {
    margin: 0,
    color: '#fcfaf7',
    fontWeight: 700,
    fontFamily: TBR_LIST_FONT_FAMILY,
  },
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
  empty: {
    padding: '12px 0 4px',
    color: 'rgba(26, 27, 75, 0.82)',
    textShadow: '0 0 14px rgba(255,255,255,0.88)',
  },
}

export function TBRList() {
  const [tbr, setTbr] = useState([])
  const [query, setQuery] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newSeries, setNewSeries] = useState('')
  const [collapsedSeries, setCollapsedSeries] = useState({})

  const [finishingTitle, setFinishingTitle] = useState(null)
  const [finishYear, setFinishYear] = useState('2026')

  useEffect(() => {
    // Ensure storage is seeded/migrated, then load.
    setTbr(getTBRBooks())

    const onChange = () => setTbr(getTBRBooks())
    window.addEventListener('readingTracker:storage', onChange)
    return () => window.removeEventListener('readingTracker:storage', onChange)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tbr
    return tbr.filter((b) => {
      if (b.title.toLowerCase().includes(q)) return true
      const s = b.series
      return typeof s === 'string' && s.toLowerCase().includes(q)
    })
  }, [query, tbr])

  const grouped = useMemo(() => {
    const bySeries = {}
    const standalone = []
    for (const b of filtered) {
      if (b.series) {
        ;(bySeries[b.series] ??= []).push(b)
      } else {
        standalone.push(b)
      }
    }
    const seriesNames = Object.keys(bySeries).sort((a, b) => a.localeCompare(b))
    return { seriesNames, bySeries, standalone }
  }, [filtered])

  function onAddTbr(e) {
    e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed) return

    const seriesTrimmed = newSeries.trim()
    const series = seriesTrimmed ? seriesTrimmed : null
    const next = dedupeTbr([...tbr, { title: trimmed, series }])
    setTbr(next)
    saveTBRBooks(next)
    setNewTitle('')
    setNewSeries('')
  }

  function onCheck(title) {
    setFinishingTitle(title)
    setFinishYear('2026')
  }

  function onConfirmFinish() {
    if (!finishingTitle) return
    const title = finishingTitle

    // 1) Add to reading log (shared storage)
    const currentRead = getReadBooks()
    const nextReadYear = currentRead[finishYear] ?? []
    const exists = nextReadYear.some((t) => normalizeTitleKey(t) === normalizeTitleKey(title))
    const nextRead = exists
      ? currentRead
      : { ...currentRead, [finishYear]: [...nextReadYear, title] }
    saveReadBooks(nextRead)

    // 2) Remove from TBR (shared storage)
    const nextTbr = tbr.filter((b) => normalizeTitleKey(b.title) !== normalizeTitleKey(title))
    setTbr(nextTbr)
    saveTBRBooks(nextTbr)

    setFinishingTitle(null)
  }

  function onCancelFinish() {
    setFinishingTitle(null)
  }

  function onDeleteTbr(title) {
    const nextTbr = tbr.filter((b) => normalizeTitleKey(b.title) !== normalizeTitleKey(title))
    setTbr(nextTbr)
    saveTBRBooks(nextTbr)
    if (finishingTitle && normalizeTitleKey(finishingTitle) === normalizeTitleKey(title)) {
      setFinishingTitle(null)
    }
  }

  function toggleSeries(name) {
    // Default is collapsed; missing key means collapsed. First click expands (false).
    setCollapsedSeries((prev) => ({ ...prev, [name]: !(prev[name] ?? true) }))
  }

  const isSearching = query.trim().length > 0

  const standaloneBooks = grouped.standalone
  const standaloneCollapsed =
    isSearching ? false : collapsedSeries[STANDALONE_TBR_KEY] !== false

  const showPhotoBg = TBR_LIST_BACKGROUND_SRC.length > 0

  /** Always paint PAGE_DEFAULT_BG on the shell so the first frame isn’t transparent while
   * `background-image` on the layer above is still loading (avoids flash of body/root color). */
  const pageShellStyle = {
    ...styles.pageShell,
    background: PAGE_DEFAULT_BG,
  }

  return (
    <div style={pageShellStyle}>
      {showPhotoBg ? (
        <>
          <img
            src={TBR_LIST_BACKGROUND_SRC}
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
            <h1 style={styles.title}>TBR List</h1>
            <p style={styles.total}>
              📋 {tbr.length} {tbr.length === 1 ? 'book' : 'books'}
            </p>
          </div>
          <p style={styles.subtitle}>Books waiting for you—organized by series.</p>
        </header>

        <section style={styles.formStrip} aria-label="Add to TBR">
          <form onSubmit={onAddTbr}>
            <div style={styles.formRow}>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Book title…"
                aria-label="New TBR book title"
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Add to TBR
              </button>
              <input
                value={newSeries}
                onChange={(e) => setNewSeries(e.target.value)}
                placeholder="Series (optional)"
                aria-label="Series name optional"
                style={{ ...styles.input, ...styles.addSeriesRow, width:'98.2%' }}
              />
            </div>
          </form>
        </section>

        <section style={styles.formStripSearch} aria-label="Search TBR">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or series…"
            aria-label="Search TBR"
            style={{ ...styles.input, width: 1427 }}
          />
        </section>

        {filtered.length === 0 ? (
          <section style={styles.sections} aria-label="TBR books">
            <div style={styles.empty}>No matching books or series.</div>
          </section>
        ) : (
          <section style={styles.sections} aria-label="TBR books">
            {grouped.seriesNames.map((seriesName) => {
              const books = grouped.bySeries[seriesName] ?? []
              const collapsed = isSearching ? false : collapsedSeries[seriesName] !== false
              const visible = collapsed ? [] : books

              return (
                <section key={seriesName} style={styles.seriesSection} aria-label={`${seriesName} books`}>
                  <button
                    type="button"
                    onClick={() => toggleSeries(seriesName)}
                    style={styles.seriesHeadingRow}
                    aria-expanded={!collapsed}
                  >
                    <h2 style={styles.seriesTitle}>
                      {collapsed ? '▶' : '▼'} {seriesName}
                    </h2>
                    <p style={styles.seriesCount}>
                      {books.length} {books.length === 1 ? 'book' : 'books'}
                    </p>
                  </button>

                  {collapsed ? null : (
                    <ul style={styles.list}>
                      {visible.map((b) => {
                        const isFinishing = finishingTitle === b.title

                        return (
                          <li key={normalizeTitleKey(b.title)} style={styles.bookItem}>
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => onCheck(b.title)}
                              aria-label={`Mark "${b.title}" as finished`}
                            />

                            <div>
                              <p style={styles.bookTitle}>{b.title}</p>

                              {isFinishing ? (
                                <div style={styles.finishPrompt}>
                                  <p style={styles.promptLabel}>Which year did you finish this?</p>
                                  <select
                                    value={finishYear}
                                    onChange={(e) => setFinishYear(e.target.value)}
                                    style={styles.select}
                                    aria-label="Finish year"
                                  >
                                    {YEAR_OPTIONS.map((y) => (
                                      <option key={y} value={y}>
                                        {y}
                                      </option>
                                    ))}
                                  </select>
                                  <button type="button" style={styles.button} onClick={onConfirmFinish}>
                                    Move to Reading Log
                                  </button>
                                  <button type="button" style={styles.buttonGhost} onClick={onCancelFinish}>
                                    Cancel
                                  </button>
                                </div>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteTbr(b.title)}
                              aria-label={`Delete "${b.title}" from TBR`}
                              title="Delete"
                              style={styles.deleteBtn}
                            >
                              ✕
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              )
            })}

            {standaloneBooks.length > 0 ? (
              <section style={styles.seriesSection} aria-label="Standalone Books">
                <button
                  type="button"
                  onClick={() => toggleSeries(STANDALONE_TBR_KEY)}
                  style={styles.seriesHeadingRow}
                  aria-expanded={!standaloneCollapsed}
                >
                  <h2 style={styles.seriesTitle}>
                    {standaloneCollapsed ? '▶' : '▼'} Standalone Books
                  </h2>
                  <p style={styles.seriesCount}>
                    {standaloneBooks.length} {standaloneBooks.length === 1 ? 'book' : 'books'}
                  </p>
                </button>

                {standaloneCollapsed ? null : (
                  <ul style={styles.list}>
                    {standaloneBooks.map((b) => {
                      const isFinishing = finishingTitle === b.title

                      return (
                        <li key={normalizeTitleKey(b.title)} style={styles.bookItem}>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => onCheck(b.title)}
                            aria-label={`Mark "${b.title}" as finished`}
                          />

                          <div>
                            <p style={styles.bookTitle}>{b.title}</p>

                            {isFinishing ? (
                              <div style={styles.finishPrompt}>
                                <p style={styles.promptLabel}>Which year did you finish this?</p>
                                <select
                                  value={finishYear}
                                  onChange={(e) => setFinishYear(e.target.value)}
                                  style={styles.select}
                                  aria-label="Finish year"
                                >
                                  {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                      {y}
                                    </option>
                                  ))}
                                </select>
                                <button type="button" style={styles.button} onClick={onConfirmFinish}>
                                  Move to Reading Log
                                </button>
                                <button type="button" style={styles.buttonGhost} onClick={onCancelFinish}>
                                  Cancel
                                </button>
                              </div>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => onDeleteTbr(b.title)}
                            aria-label={`Delete "${b.title}" from TBR`}
                            title="Delete"
                            style={styles.deleteBtn}
                          >
                            ✕
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            ) : null}
          </section>
        )}
      </div>
    </div>
    )
  }


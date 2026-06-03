import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { buildSeriesCatalog } from '../data/books.js'
import { getReadBooks, getTBRBooks, inferTbrSeries } from '../data/storage.js'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', 'Previous Years']

const PAGE_DEFAULT_BG =
  'radial-gradient(1100px 500px at 20% 0%, rgba(84, 58, 183, 0.18), transparent 55%), radial-gradient(900px 450px at 80% 10%, rgba(26, 27, 75, 0.16), transparent 52%), #f6f5ff'

const READING_LOG_BACKGROUND_SRC = '/dashboard.jpg'
const READING_LOG_BG_BRIGHTNESS = 0.75
const READING_LOG_FONT_FAMILY = '"Times New Roman", Times, serif'

function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

function collectReadTitleSet(readByYear) {
  const set = new Set()
  for (const y of YEAR_OPTIONS) {
    for (const t of readByYear[y] ?? []) {
      set.add(normalizeTitleKey(t))
    }
  }
  return set
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
    paddingBottom: 32,
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
    marginBottom: 8,
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
  badge: {
    margin: 0,
    color: '#ebdecc',
    fontWeight: 800,
    justifySelf: 'end',
    textAlign: 'right',
    fontSize: 18,
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
  section: {
    marginTop: 22,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    padding: 0,
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: 20,
    fontWeight: 800,
    color: '#ebdecc',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: READING_LOG_FONT_FAMILY,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 10,
  },
  statCard: {
    padding: '10px 12px',
    borderRadius: 14,
    background: '#a18770',
    border: '1px solid rgba(26, 27, 75, 0.10)',
    backdropFilter: 'blur(6px)',
  },
  statLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 750,
    color: 'rgba(252, 250, 247, 0.78)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  statValue: {
    margin: '6px 0 0',
    fontSize: 22,
    fontWeight: 900,
    color: '#fcfaf7',
  },
  yearBarRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 36px',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    padding: '10px 12px',
    borderRadius: 14,
    background: '#a18770',
    border: '1px solid rgba(26, 27, 75, 0.10)',
    backdropFilter: 'blur(6px)',
  },
  yearLabel: { margin: 0, fontWeight: 800, fontSize: 14, color: '#fcfaf7' },
  barTrack: {
    height: 12,
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.22)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #fcfaf7 0%, rgba(252, 250, 247, 0.72) 100%)',
    minWidth: 4,
    transition: 'width 200ms ease',
  },
  barCount: { margin: 0, fontSize: 14, fontWeight: 800, color: '#fcfaf7', textAlign: 'right' },
  bodyText: {
    margin: '0 0 10px',
    color: 'rgba(26, 27, 75, 0.82)',
    lineHeight: 1.5,
    textShadow: '0 0 14px rgba(255,255,255,0.88)',
  },
  bodyTextLast: {
    margin: 0,
    color: 'rgba(26, 27, 75, 0.82)',
    lineHeight: 1.5,
    textShadow: '0 0 14px rgba(255,255,255,0.88)',
  },
  bodyTextOnTile: {
    margin: '0 0 10px',
    color: '#fcfaf7',
    lineHeight: 1.5,
  },
  bodyTextOnTileLast: {
    margin: 0,
    color: '#fcfaf7',
    lineHeight: 1.5,
  },
  insightList: {
    margin: 0,
    paddingLeft: 18,
    color: 'rgba(26, 27, 75, 0.82)',
    lineHeight: 1.6,
    textShadow: '0 0 14px rgba(255,255,255,0.88)',
  },
  insightPanel: {
    padding: '10px 12px',
    borderRadius: 14,
    background: '#a18770',
    border: '1px solid rgba(26, 27, 75, 0.10)',
    backdropFilter: 'blur(6px)',
  },
  insightListOnTile: {
    margin: 0,
    paddingLeft: 18,
    color: '#fcfaf7',
    lineHeight: 1.6,
  },
  muted: { margin: '8px 0 0', fontSize: 14, color: 'rgba(252, 250, 247, 0.85)', lineHeight: 1.5 },
  seriesItem: {
    padding: '10px 12px',
    borderRadius: 14,
    background: '#a18770',
    border: '1px solid rgba(26, 27, 75, 0.10)',
    backdropFilter: 'blur(6px)',
    marginBottom: 10,
  },
  seriesHead: { margin: 0, fontWeight: 850, fontSize: 18, color: '#fcfaf7' },
  seriesSub: { margin: '6px 0 0', fontSize: 14, color: 'rgba(252, 250, 247, 0.9)' },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  actionLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.18)',
    background: '#a18770',
    color: '#fff',
    fontWeight: 750,
    textDecoration: 'none',
    fontSize: 14,
    fontFamily: READING_LOG_FONT_FAMILY,
  },
  actionLinkGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.18)',
    background: '#a18770',
    color: '#fff',
    fontWeight: 750,
    textDecoration: 'none',
    fontSize: 14,
    fontFamily: READING_LOG_FONT_FAMILY,
  },
  emptyOnPhoto: {
    margin: '8px 0 0',
    fontSize: 14,
    color: 'rgba(26, 27, 75, 0.82)',
    lineHeight: 1.5,
    textShadow: '0 0 14px rgba(255,255,255,0.88)',
  },
}

export function Dashboard() {
  const [readByYear, setReadByYear] = useState(() => getReadBooks())
  const [tbr, setTbr] = useState(() => getTBRBooks())

  useEffect(() => {
    const onChange = () => {
      setReadByYear(getReadBooks())
      setTbr(getTBRBooks())
    }
    window.addEventListener('readingTracker:storage', onChange)
    return () => window.removeEventListener('readingTracker:storage', onChange)
  }, [])

  const stats = useMemo(() => {
    const readSet = collectReadTitleSet(readByYear)
    const counts = {}
    let total = 0
    for (const y of YEAR_OPTIONS) {
      const n = (readByYear[y] ?? []).length
      counts[y] = n
      total += n
    }

    const yearsWithData = YEAR_OPTIONS.filter((y) => counts[y] > 0)
    const avgAmongLoggedYears =
      yearsWithData.length > 0 ? Math.round((total / yearsWithData.length) * 10) / 10 : 0

    let bestYear = null
    let bestCount = -1
    for (const y of YEAR_OPTIONS) {
      const c = counts[y]
      if (c > bestCount) {
        bestCount = c
        bestYear = y
      }
    }
    if (bestCount <= 0) bestYear = null

    const catalog = buildSeriesCatalog()
    const readCountBySeries = {}
    for (const y of YEAR_OPTIONS) {
      for (const title of readByYear[y] ?? []) {
        const s = inferTbrSeries(title)
        if (!s) continue
        readCountBySeries[s] = (readCountBySeries[s] ?? 0) + 1
      }
    }

    let mostReadSeries = null
    let mostReadCount = -1
    for (const [s, c] of Object.entries(readCountBySeries)) {
      if (c > mostReadCount) {
        mostReadCount = c
        mostReadSeries = s
      }
    }

    let longestCompleted = null
    let longestN = 0
    for (const [seriesName, titles] of catalog.entries()) {
      if (titles.length === 0) continue
      const allRead = titles.every((t) => readSet.has(normalizeTitleKey(t)))
      if (allRead && titles.length > longestN) {
        longestN = titles.length
        longestCompleted = seriesName
      }
    }

    const inProgressSeries = []
    for (const [seriesName, titles] of catalog.entries()) {
      const readIn = titles.filter((t) => readSet.has(normalizeTitleKey(t))).length
      if (readIn > 0 && readIn < titles.length) {
        inProgressSeries.push({
          name: seriesName,
          read: readIn,
          total: titles.length,
        })
      }
    }
    inProgressSeries.sort(
      (a, b) => b.read / Math.max(1, b.total) - a.read / Math.max(1, a.total),
    )

    const tbrBySeries = new Map()
    for (const b of tbr) {
      if (!b.series) continue
      if (!tbrBySeries.has(b.series)) tbrBySeries.set(b.series, [])
      tbrBySeries.get(b.series).push(b)
    }

    const activeSeries = []
    for (const row of inProgressSeries) {
      const onTbr = tbrBySeries.get(row.name) ?? []
      const order = catalog.get(row.name) ?? []
      const nextUnread =
        order.find((t) => !readSet.has(normalizeTitleKey(t))) ?? onTbr[0]?.title ?? null
      activeSeries.push({
        ...row,
        nextUnread,
        tbrLeft: onTbr.length,
      })
    }

    let longestCatalogSeriesName = null
    let longestCatalogN = 0
    for (const [name, titles] of catalog.entries()) {
      if (titles.length > longestCatalogN) {
        longestCatalogN = titles.length
        longestCatalogSeriesName = name
      }
    }

    const idx2026 = YEAR_OPTIONS.indexOf('2026')
    const idx2025 = YEAR_OPTIONS.indexOf('2025')
    const c2026 = counts['2026'] ?? 0
    const c2025 = counts['2025'] ?? 0
    let trendMsg = null
    if ((counts['2026'] ?? 0) > 0 || (counts['2025'] ?? 0) > 0) {
      const diff = c2026 - c2025
      if (diff > 0) trendMsg = `You’ve logged ${Math.abs(diff)} more book${Math.abs(diff) === 1 ? '' : 's'} in 2026 than in 2025 so far.`
      else if (diff < 0)
        trendMsg = `2025 still leads 2026 by ${Math.abs(diff)} book${Math.abs(diff) === 1 ? '' : 's'}—plenty of year left.`
      else trendMsg = '2026 and 2025 are tied so far.'
    }

    const now = new Date()
    const monthIdx = now.getMonth() + 1
    const booksThisYear = counts['2026'] ?? 0
    const perMonth2026 = monthIdx > 0 ? Math.round((booksThisYear / monthIdx) * 10) / 10 : 0

    return {
      counts,
      total,
      yearsWithData,
      avgAmongLoggedYears,
      mostProductiveYear: bestYear,
      maxBar: Math.max(1, ...YEAR_OPTIONS.map((y) => counts[y])),
      readCountBySeries,
      mostReadSeries,
      mostReadCount: mostReadCount > 0 ? mostReadCount : null,
      longestCompleted,
      longestCompletedN: longestN,
      inProgressSeries,
      activeSeries,
      longestCatalogSeriesName,
      longestCatalogLen: longestCatalogN,
      trendMsg,
      perMonth2026,
      monthIdx,
    }
  }, [readByYear, tbr])

  const showPhotoBg = READING_LOG_BACKGROUND_SRC.length > 0
  /** Base gradient under the photo layer avoids a transparent first paint while `background-image` loads. */
  const pageShellStyle = {
    ...styles.pageShell,
    background: PAGE_DEFAULT_BG,
  }

  const funLongestSeries =
    stats.longestCatalogLen > 0
      ? `Longest series in your catalog: ${stats.longestCatalogSeriesName ?? 'a series'} (${stats.longestCatalogLen} books).`
      : null

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
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.badge}>
              📊 {stats.total} total
            </p>
          </div>
          <p style={styles.subtitle}>
            Reading stats, yearly progress, series insights, and quick links—your tracker at a glance.
          </p>
        </header>

        <section style={styles.section} aria-label="Reading stats">
          <h2 style={styles.sectionTitle}>📊 Reading stats</h2>
          <div style={styles.statGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total books read</p>
              <p style={styles.statValue}>{stats.total}</p>
              <p style={styles.muted}>All time, all year buckets.</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>2026</p>
              <p style={styles.statValue}>{stats.counts['2026']}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>2025</p>
              <p style={styles.statValue}>{stats.counts['2025']}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>2024</p>
              <p style={styles.statValue}>{stats.counts['2024']}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>2023</p>
              <p style={styles.statValue}>{stats.counts['2023']}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Previous years</p>
              <p style={styles.statValue}>{stats.counts['Previous Years']}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Avg books / year</p>
              <p style={styles.statValue}>
                {stats.yearsWithData.length ? stats.avgAmongLoggedYears : '—'}
              </p>
              <p style={styles.muted}>Among years with at least one logged book.</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Most productive year</p>
              <p style={styles.statValue}>{stats.mostProductiveYear ?? '—'}</p>
              {stats.mostProductiveYear ? (
                <p style={styles.muted}>{stats.counts[stats.mostProductiveYear]} books logged.</p>
              ) : (
                <p style={styles.muted}>Log books in Reading Log to see this.</p>
              )}
            </div>
          </div>
        </section>

        <section style={styles.section} aria-label="Year by year chart">
          <h2 style={styles.sectionTitle}>📈 Year-by-year progress</h2>
          {YEAR_OPTIONS.map((y) => {
            const n = stats.counts[y]
            const pct = stats.maxBar ? Math.round((n / stats.maxBar) * 100) : 0
            return (
              <div key={y} style={styles.yearBarRow}>
                <p style={styles.yearLabel}>{y}</p>
                <div style={styles.barTrack} aria-hidden="true">
                  <div style={{ ...styles.barFill, width: `${pct}%` }} />
                </div>
                <p style={styles.barCount}>{n}</p>
              </div>
            )
          })}
        </section>

        <section style={styles.section} aria-label="Reading breakdown">
          <h2 style={styles.sectionTitle}>📚 Reading breakdown</h2>
          <div style={styles.insightPanel}>
            <p style={styles.bodyTextOnTile}>
              <strong>Most read series:</strong>{' '}
              {stats.mostReadSeries
                ? `${stats.mostReadSeries} (${stats.mostReadCount} books logged)`
                : 'Not enough series-tagged reads yet—keep logging!'}
            </p>
            <p style={styles.bodyTextOnTile}>
              <strong>Longest series completed:</strong>{' '}
              {stats.longestCompleted
                ? `${stats.longestCompleted} (${stats.longestCompletedN} books)`
                : 'Complete every title in a catalog series to unlock this.'}
            </p>
            <p style={styles.bodyTextOnTileLast}>
              <strong>Series in progress:</strong>{' '}
              {stats.inProgressSeries.length
                ? `${stats.inProgressSeries.length} series with some books read and some still to go.`
                : 'None detected from your catalog + log yet.'}
            </p>
          </div>
        </section>

        <section style={styles.section} aria-label="Activity insights">
          <h2 style={styles.sectionTitle}>🔥 Reading activity</h2>
          <div style={styles.insightPanel}>
            <ul style={styles.insightListOnTile}>
              {stats.mostProductiveYear ? (
                <li>
                  You logged the most books in <strong>{stats.mostProductiveYear}</strong> (
                  {stats.counts[stats.mostProductiveYear]} books).
                </li>
              ) : (
                <li>Add finished books to your Reading Log to unlock year insights.</li>
              )}
              <li>
                Rough pace this year (2026): ~<strong>{stats.perMonth2026}</strong> books/month over{' '}
                {stats.monthIdx} month{stats.monthIdx === 1 ? '' : 's'} (logged in-app).
              </li>
              {stats.trendMsg ? <li>{stats.trendMsg}</li> : null}
            </ul>
          </div>
        </section>

        <section style={styles.section} aria-label="Active series">
          <h2 style={styles.sectionTitle}>📌 Currently active series</h2>
          {stats.activeSeries.length === 0 ? (
            <p style={styles.emptyOnPhoto}>No partial series detected (or none in your TBR catalog with mixed progress).</p>
          ) : (
            stats.activeSeries.map((row) => (
              <div key={row.name} style={styles.seriesItem}>
                <p style={styles.seriesHead}>{row.name}</p>
                <p style={styles.seriesSub}>
                  Progress: {row.read} / {row.total} read
                  {row.nextUnread ? (
                    <>
                      {' '}
                      · Next up: <strong>{row.nextUnread}</strong>
                    </>
                  ) : null}
                  {row.tbrLeft ? (
                    <>
                      {' '}
                      · {row.tbrLeft} still on TBR
                    </>
                  ) : null}
                </p>
              </div>
            ))
          )}
        </section>

        <section style={styles.section} aria-label="Fun insights">
          <h2 style={styles.sectionTitle}>🧠 Fun insights</h2>
          <div style={styles.insightPanel}>
            <ul style={styles.insightListOnTile}>
              {funLongestSeries ? <li>{funLongestSeries}</li> : (
                <li>Log more books to unlock fun insights.</li>
              )}
            </ul>
          </div>
        </section>

        <section style={styles.section} aria-label="Quick actions">
          <h2 style={styles.sectionTitle}>⚡ Quick actions</h2>
          <div style={styles.actionsRow}>
            <Link to="/" style={styles.actionLink}>
              ➕ Add book
            </Link>
            <Link to="/" style={styles.actionLinkGhost}>
              📖 Reading Log
            </Link>
            <Link to="/tbr" style={styles.actionLinkGhost}>
              📚 Open TBR
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

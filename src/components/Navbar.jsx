import { Link, NavLink } from 'react-router-dom'

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#523f26',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
  },
  inner: {
    width: '100%',
    maxWidth: 'none',
    margin: 0,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minWidth: 0,
    boxSizing: 'border-box',
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 0,
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '0.2px',
    flex: '1 1 0%',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  brandIcon: { filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.35))' , marginRight:6},
  brandText: {
    display: 'block',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 800,
    fontSize: 25,
    fontFamily: '"Times New Roman", Times, serif',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  linkBase: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.95)',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.20)',
    background: 'rgba(255,255,255,0.10)',
    fontWeight: 650,
    fontSize: 14,
    fontFamily: '"Times New Roman", Times, serif',
    whiteSpace: 'nowrap',
  },
  linkActive: {
    color: '#fff',
    background: 'rgba(255,255,255,0.24)',
    borderColor: 'rgba(255,255,255,0.40)',
  },
  tbrLink: {
    marginLeft: 0,
  },
}

function linkStyle({ isActive }) {
  return isActive ? { ...styles.linkBase, ...styles.linkActive } : styles.linkBase
}

export function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand} aria-label="Reading Tracker home">
          <span style={styles.brandText}>Reading Tracker</span>
        </Link>
        <nav style={styles.nav} aria-label="Primary">
          <NavLink to="/" end style={linkStyle}>
            Reading Log
          </NavLink>
          <NavLink to="/tbr" style={(args) => ({ ...linkStyle(args), ...styles.tbrLink })}>
            TBR List
          </NavLink>
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  )
}


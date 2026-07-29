import { useEffect, useState } from 'react'
import './PillNav.css'

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  baseColor = '#D4FF00',
  pillColor = '#10231F',
  hoveredPillTextColor = '#10231F',
  pillTextColor = '#F2F2ED',
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isReady, setIsReady] = useState(!initialLoadAnimation)

  useEffect(() => {
    if (!initialLoadAnimation) return undefined
    const frame = requestAnimationFrame(() => setIsReady(true))
    return () => cancelAnimationFrame(frame)
  }, [initialLoadAnimation])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    const closeOnDesktop = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open)
    onMobileMenuClick?.()
  }

  const cssVars = {
    '--nav-accent': baseColor,
    '--nav-ink': pillColor,
    '--nav-accent-ink': hoveredPillTextColor,
    '--nav-text': pillTextColor,
  }

  return (
    <div className={`pill-nav-container${isReady ? ' is-ready' : ''}`} style={cssVars}>
      <nav className={`pill-nav ${className}`} aria-label="Primary">
        <a className="pill-logo" href="#top" aria-label="Blinq home">
          <span className="pill-logo-mark">
            <img src={logo} alt="" aria-hidden="true" />
          </span>
          <span className="pill-wordmark">
            <strong>{logoAlt}</strong>
            <small>Mobility / 01</small>
          </span>
        </a>

        <div className="pill-nav-items desktop-only">
          <ul className="pill-list">
            {items.map((item, index) => {
              const isActive = activeHref === item.href
              const isCta = index === items.length - 1
              return (
                <li key={item.href || `item-${index}`}>
                  <a
                    href={item.href}
                    className={`pill${isActive ? ' is-active' : ''}${isCta ? ' is-cta' : ''}`}
                    aria-label={item.ariaLabel || item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="pill-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <button
          className={`mobile-menu-button mobile-only${isMobileMenuOpen ? ' is-open' : ''}`}
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-primary-menu"
        >
          <span className="mobile-menu-label">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          <span className="hamburger-icon" aria-hidden="true">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </span>
        </button>
      </nav>

      <div
        id="mobile-primary-menu"
        className={`mobile-menu-popover mobile-only${isMobileMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <p className="mobile-menu-kicker">Navigate / Blinq Mobility</p>
        <ul className="mobile-menu-list">
          {items.map((item, index) => {
            const isActive = activeHref === item.href
            const isCta = index === items.length - 1
            return (
              <li key={item.href || `mobile-item-${index}`}>
                <a
                  href={item.href}
                  className={`mobile-menu-link${isActive ? ' is-active' : ''}${isCta ? ' is-cta' : ''}`}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
        <div className="mobile-menu-status">
          <span aria-hidden="true" />
          Network online
        </div>
      </div>
    </div>
  )
}

export default PillNav

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './PillNav.css'

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#120F17',
  hoveredPillTextColor = '#120F17',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const circleRefs = useRef([])
  const timelineRefs = useRef([])
  const activeTweenRefs = useRef([])
  const logoImgRef = useRef(null)
  const logoTweenRef = useRef(null)
  const hamburgerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navItemsRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return
        const pill = circle.parentElement
        const { width, height } = pill.getBoundingClientRect()
        const radius = ((width * width) / 4 + height * height) / (2 * height)
        const diameter = Math.ceil(2 * radius) + 2
        const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) + 1
        const originY = diameter - delta

        circle.style.width = `${diameter}px`
        circle.style.height = `${diameter}px`
        circle.style.bottom = `-${delta}px`
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

        const label = pill.querySelector('.pill-label')
        const hoverLabel = pill.querySelector('.pill-label-hover')
        if (label) gsap.set(label, { y: 0 })
        if (hoverLabel) gsap.set(hoverLabel, { y: height + 12, opacity: 0 })

        timelineRefs.current[index]?.kill()
        const timeline = gsap.timeline({ paused: true })
        timeline.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)
        if (label) timeline.to(label, { y: -(height + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(height + 100), opacity: 0 })
          timeline.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        }
        timelineRefs.current[index] = timeline
      })
    }

    layout()
    window.addEventListener('resize', layout)
    document.fonts?.ready.then(layout).catch(() => {})

    if (mobileMenuRef.current) gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0, scaleY: 1 })

    if (initialLoadAnimation) {
      if (logoRef.current) {
        gsap.set(logoRef.current, { scale: 0 })
        gsap.to(logoRef.current, { scale: 1, duration: 0.6, ease })
      }
      if (navItemsRef.current) {
        gsap.set(navItemsRef.current, { width: 0, overflow: 'hidden' })
        gsap.to(navItemsRef.current, { width: 'auto', duration: 0.6, ease, clearProps: 'overflow' })
      }
    }

    return () => {
      window.removeEventListener('resize', layout)
      timelineRefs.current.forEach((timeline) => timeline?.kill())
      activeTweenRefs.current.forEach((tween) => tween?.kill())
      logoTweenRef.current?.kill()
    }
  }, [items, ease, initialLoadAnimation])

  const handleEnter = (index) => {
    const timeline = timelineRefs.current[index]
    if (!timeline) return
    activeTweenRefs.current[index]?.kill()
    activeTweenRefs.current[index] = timeline.tweenTo(timeline.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }

  const handleLeave = (index) => {
    const timeline = timelineRefs.current[index]
    if (!timeline) return
    activeTweenRefs.current[index]?.kill()
    activeTweenRefs.current[index] = timeline.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  const handleLogoEnter = () => {
    if (!logoImgRef.current) return
    logoTweenRef.current?.kill()
    gsap.set(logoImgRef.current, { rotate: 0 })
    logoTweenRef.current = gsap.to(logoImgRef.current, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' })
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    const lines = hamburgerRef.current?.querySelectorAll('.hamburger-line')
    if (lines?.length) {
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease })
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease })
    }
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease,
        onComplete: () => gsap.set(mobileMenuRef.current, { visibility: 'hidden' }),
      })
    }
  }

  const toggleMobileMenu = () => {
    const nextOpen = !isMobileMenuOpen
    setIsMobileMenuOpen(nextOpen)
    const lines = hamburgerRef.current?.querySelectorAll('.hamburger-line')
    if (lines?.length) {
      gsap.to(lines[0], { rotation: nextOpen ? 45 : 0, y: nextOpen ? 3 : 0, duration: 0.3, ease })
      gsap.to(lines[1], { rotation: nextOpen ? -45 : 0, y: nextOpen ? -3 : 0, duration: 0.3, ease })
    }
    if (mobileMenuRef.current) {
      if (nextOpen) {
        gsap.set(mobileMenuRef.current, { visibility: 'visible' })
        gsap.fromTo(mobileMenuRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease })
      } else {
        closeMobileMenu()
      }
    }
    onMobileMenuClick?.()
  }

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
  }

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        <a className="pill-logo" href="#top" aria-label="Blinq home" onMouseEnter={handleLogoEnter} ref={logoRef}>
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </a>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, index) => (
              <li key={item.href || `item-${index}`} role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onMouseEnter={() => handleEnter(index)}
                  onMouseLeave={() => handleLeave(index)}
                >
                  <span className="hover-circle" aria-hidden="true" ref={(element) => { circleRefs.current[index] = element }} />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button className="mobile-menu-button mobile-only" type="button" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} ref={hamburgerRef}>
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item, index) => (
            <li key={item.href || `mobile-item-${index}`}>
              <a href={item.href} className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`} onClick={closeMobileMenu}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PillNav

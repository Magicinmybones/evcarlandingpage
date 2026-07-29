import { useEffect, useRef } from 'react'

const brands = [
  { name: 'JIM Ventures', image: '/assets/support/mono/jim-ventures.png' },
  { name: 'FiiRE', image: '/assets/support/mono/fiire.png' },
  { name: 'Startup India Seed Fund Scheme', image: '/assets/support/mono/startup-india-seed-fund.png', shape: 'tall' },
  { name: 'NIDHI PRAYAS', image: '/assets/support/mono/nidhi-prayas-square.png' },
  { name: 'Nexus Startup Hub', image: '/assets/support/mono/nexus.png' },
  { name: 'Razorpay', image: '/assets/support/mono/razorpay.png' },
  { name: 'Deshpande Foundation', image: '/assets/support/mono/deshpande-foundation.png' },
  { name: 'NIDHI PRAYAS', image: '/assets/support/mono/nidhi-prayas-wide.png' },
  { name: 'IIT Startups', image: '/assets/support/mono/iit-startups.png', shape: 'tall' },
  { name: 'ARAI-AMTIF', image: '/assets/support/mono/arai-amtif.png' },
  { name: 'DPIIT Startup India', image: '/assets/support/mono/dpiit-startup-india.png' },
  { name: 'Ministry of Electronics and Information Technology', image: '/assets/support/mono/meity.png', shape: 'dense' },
  { name: '8i Ventures', image: '/assets/support/mono/8i-ventures.png', shape: 'tall' },
  { name: 'Operators Studio', image: '/assets/support/mono/operators-studio.png' },
]

const columnCount = 7
const emptyCellCount = 7

function getRevealOrder(index) {
  const row = Math.floor(index / columnCount)
  const column = index % columnCount
  return row % 2 === 0
    ? row * columnCount + column
    : row * columnCount + (columnCount - 1 - column)
}

function GridCorners() {
  return (
    <span className="brand-corners" aria-hidden="true">
      <i className="is-top-left" />
      <i className="is-top-right" />
      <i className="is-bottom-left" />
      <i className="is-bottom-right" />
    </span>
  )
}

function BrandGrid() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) {
      section.classList.add('is-revealed', 'is-settled')
      return undefined
    }

    let settleTimer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        section.classList.add('is-revealed')
        settleTimer = window.setTimeout(() => section.classList.add('is-settled'), 3600)
        observer.disconnect()
      },
      { threshold: 0.16 },
    )

    observer.observe(section)
    return () => {
      observer.disconnect()
      window.clearTimeout(settleTimer)
    }
  }, [])

  return (
    <section className="brand-grid-section" aria-labelledby="brand-grid-title" ref={sectionRef}>
      <div className="brand-signal brand-signal-in" aria-hidden="true">
        <span />
      </div>

      <div className="brand-grid-heading">
        <div className="brand-grid-kicker" aria-hidden="true">
          <span>THE ECOSYSTEM</span>
          <span className="brand-grid-kicker-rule" />
          <span>01—14</span>
        </div>
        <h2 id="brand-grid-title">
          <span className="brand-heading-line"><span>Supported by the brands</span></span>
          <span className="brand-heading-line"><span>moving us forward</span></span>
        </h2>
      </div>

      <div className="brand-grid-wrap">
        <div className="brand-grid-scan" aria-hidden="true"><span /></div>
        <div className="brand-grid" aria-label="Organizations supporting Blinq">
          {brands.map(({ name, image, shape }, index) => (
            <div
              className="brand-cell"
              key={`${name}-${index}`}
              style={{ '--brand-step': `${getRevealOrder(index) * 42}ms`, '--logo-step': `${getRevealOrder(index) * 48}ms` }}
            >
              <GridCorners />
              <img
                className={`brand-logo${shape ? ` is-${shape}` : ''}`}
                src={image}
                alt={name}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
          {Array.from({ length: emptyCellCount }, (_, index) => (
            <div
              className="brand-cell brand-cell-empty"
              aria-hidden="true"
              key={`empty-${index}`}
              style={{ '--brand-step': `${getRevealOrder(brands.length + index) * 42}ms`, '--logo-step': `${getRevealOrder(brands.length + index) * 48}ms` }}
            >
              <GridCorners />
            </div>
          ))}
        </div>
        <div className="brand-grid-foot" aria-hidden="true">
          <span>BLINQ / ALLIANCE NETWORK</span>
          <span className="brand-grid-foot-pulse" />
          <span>CONNECTED</span>
        </div>
      </div>

      <div className="brand-signal brand-signal-out" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

export default BrandGrid

import { Fragment, useEffect, useRef, useState } from 'react'
import DotGrid from './components/DotGrid.jsx'
import BlinqFooter from './components/BlinqFooter.tsx'
import BrandGrid from './components/BrandGrid.jsx'
import PillNav from './components/PillNav.jsx'
import ProjectsSection from './components/ProjectsSection.tsx'

const headline = ['Drive', 'in', 'empty,', 'drive', 'out', 'full', 'in', 'ninety', 'seconds']

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Station', href: '#station' },
  { label: 'Network', href: '#network' },
  { label: 'How It Works', href: '#about' },
  { label: 'Insights', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const features = [
  {
    eyebrow: '01 / 03',
    title: 'The swap, not the wait',
    copy: 'Guided onto the pad by the station itself, the exchange happens below the floor. A fresh pack is fitted in 90 seconds, up to 8× faster than a rapid charger.',
    video: '/assets/swap-not-the-wait.mp4',
    alt: 'An automated Blinq battery swap in progress',
    label: '· BAY 01 · PAD LOCKED',
  },
  {
    eyebrow: '02 / 03',
    title: 'Your bay is booked before you arrive',
    copy: 'The car reserves a pad along your route and the station pre-stages a charged pack. You roll straight in, with no queue and no guessing.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=82',
    alt: 'Night highway light trails, your route with a bay booked ahead',
    label: '· BAY 02 · RESERVED',
  },
  {
    eyebrow: '03 / 03',
    title: 'Batteries that live longer',
    copy: 'Every returned pack is health-checked and recharged slowly, off-peak. It is kinder to the grid and the cells, and you always leave with a certified pack.',
    image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&w=1600&q=82',
    alt: 'Electric vehicle charging port, every pack is health-checked and certified',
    label: '· PACK 7F31 · HEALTH 98%',
  },
]

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function Hero() {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return undefined

    const words = [...wrap.querySelectorAll('[data-word]')]
    const hint = wrap.querySelector('.scroll-hint')
    const hud = wrap.querySelector('.hero-hud')
    const timer = wrap.querySelector('.hud-timer')
    let raf = 0
    let lastTime = -1
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const updateTarget = () => {
      const rect = wrap.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      targetRef.current = clamp(-rect.top / distance)
    }

    const tick = () => {
      const ease = reducedMotion ? 1 : 0.095
      progressRef.current += (targetRef.current - progressRef.current) * ease
      if (Math.abs(targetRef.current - progressRef.current) < 0.0001) {
        progressRef.current = targetRef.current
      }

      const progress = progressRef.current
      wrap.style.setProperty('--hero-progress', progress.toFixed(4))

      if (hint) {
        hint.style.opacity = Math.max(0, 1 - progress * 10)
        hint.style.transform = `translateY(${-progress * 140}px)`
      }
      if (hud) hud.style.opacity = Math.max(0, 1 - progress * 3)
      if (timer) timer.textContent = `T-${(90 - progress * 90).toFixed(1)}S`
      const wordSpan = 0.72 / words.length
      words.forEach((word, index) => {
        const reveal = clamp((progress - (0.06 + index * wordSpan)) / 0.1)
        word.style.opacity = reveal
        word.style.transform = `translateY(${(1 - reveal) * 0.45}em)`
      })

      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        const nextTime = progress * Math.max(0, video.duration - 0.034)
        if (Math.abs(nextTime - lastTime) > 0.012) {
          video.currentTime = nextTime
          lastTime = nextTime
        }
      }

      raf = requestAnimationFrame(tick)
    }

    const primeVideo = () => {
      video.pause()
      video.currentTime = 0
      setReady(true)
    }

    updateTarget()
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    video.addEventListener('loadedmetadata', primeVideo, { once: true })
    if (video.readyState >= 1) primeVideo()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      video.removeEventListener('loadedmetadata', primeVideo)
    }
  }, [])

  return (
    <section className={`hero-scroll ${ready ? 'is-ready' : ''}`} ref={wrapRef} id="top">
      <div className="hero-sticky">
        <video
          ref={videoRef}
          className="hero-video"
          src="/assets/hero-scroll-v14-scrub.mp4"
          poster="/assets/hero-poster.jpg"
          preload="auto"
          muted
          playsInline
          aria-label="A Blinq electric vehicle completing an automated battery swap"
        />
        <div className="hero-wash" />
        <div className="video-loader" aria-hidden="true"><span /></div>
        <div className="scroll-hint">SCROLL&nbsp;&nbsp;TO&nbsp;&nbsp;EXPLORE</div>
        <div className="hero-hud" aria-hidden="true">
          <span className="accent">● BAY 01 · SWAP IN PROGRESS</span>
          <span className="hud-timer">T-90.0S</span>
        </div>
        <h1 className="hero-title">
          {headline.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              {index === 6 && <span className="hero-line-break" aria-hidden="true" />}
              <span
                data-word
                className={index > 6 ? 'accent' : ''}
              >
                {word}
              </span>
            </Fragment>
          ))}
        </h1>
      </div>
    </section>
  )
}

function FeatureStory() {
  const wrapRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return undefined

    let queued = false
    const update = () => {
      const rect = wrap.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / range)
      setActive(Math.min(features.length - 1, Math.floor(progress * features.length)))
      queued = false
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="feature-scroll" ref={wrapRef} id="station">
      <div className="feature-sticky">
        <div className="feature-grid">
          <div className="feature-copy-stack">
            {features.map((feature, index) => (
              <article key={feature.title} className={`feature-copy ${active === index ? 'is-active' : ''} ${index < active ? 'is-before' : ''}`}>
                <span className="feature-eyebrow">{feature.eyebrow}</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
          <div className="feature-media">
            {features.map((feature, index) => (
              feature.video ? (
                <video
                  key={feature.video}
                  className={active === index ? 'is-active' : ''}
                  src={feature.video}
                  aria-label={feature.alt}
                  preload="auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  key={feature.image}
                  className={active === index ? 'is-active' : ''}
                  src={feature.image}
                  alt={feature.alt}
                  loading="lazy"
                  decoding="async"
                />
              )
            ))}
            <div className="media-wash" />
            <span className="check-in">· CHECK IN: 2:34 PM</span>
            <span className="feature-label">{features[active].label}</span>
            <div className="feature-dots" aria-hidden="true">
              {features.map((feature, index) => <span key={feature.title} className={active === index ? 'is-active' : ''} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Statement() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return undefined
    const words = [...heading.querySelectorAll('[data-statement-word]')]
    const phaseWords = [...section.querySelectorAll('[data-phase-word]')]
    const phaseSteps = [...section.querySelectorAll('[data-phase-step]')]
    let queued = false
    let previousPhase = -1

    const update = () => {
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = clamp(-rect.top / distance)
      const revealProgress = clamp(progress / 0.24)
      const activeWords = Math.floor(revealProgress * (words.length + 1))
      const cycleProgress = clamp((progress - 0.08) / 0.84)
      const phase = Math.min(2, Math.floor(cycleProgress * 3))

      section.style.setProperty('--statement-progress', progress.toFixed(4))
      section.style.setProperty('--statement-cycle-progress', cycleProgress.toFixed(4))
      section.classList.toggle('is-visible', progress > 0.015)
      words.forEach((word, index) => word.classList.toggle('is-active', index < activeWords))

      if (phase !== previousPhase) {
        phaseWords.forEach((word, index) => word.classList.toggle('is-active', index === phase))
        phaseSteps.forEach((step, index) => {
          step.classList.toggle('is-active', index === phase)
          if (index === phase) step.setAttribute('aria-current', 'step')
          else step.removeAttribute('aria-current')
        })
        previousPhase = phase
      }
      queued = false
    }

    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="statement" id="about" ref={sectionRef}>
      <div className="statement-atmosphere" aria-hidden="true">
        <DotGrid
          className="statement-dot-grid"
          dotSize={3}
          gap={23}
          baseColor="#263029"
          activeColor="#D4FF00"
          proximity={145}
          speedTrigger={115}
          shockRadius={230}
          shockStrength={3.5}
          resistance={850}
          returnDuration={1.4}
        />
      </div>
      <div className="statement-inner">
        <div className="statement-phase-stage" aria-hidden="true">
          <span className="statement-phase-word is-active" data-phase-word>SWAP</span>
          <span className="statement-phase-word" data-phase-word>DRIVE</span>
          <span className="statement-phase-word" data-phase-word>REPEAT</span>
        </div>
        <p className="statement-kicker"><span /> COMPACT EVS / QUICK BATTERY SWAPS <span /></p>
        <h2 ref={headingRef}>
          <span className="statement-line">
            <span data-statement-word>Revolutionizing</span>
            <span data-statement-word>Urban</span>
          </span>
          <span className="statement-line">
            <span data-statement-word>Mobility</span>
            <span data-statement-word>with</span>
            <span data-statement-word>Compact</span>
            <span data-statement-word>EVs</span>
          </span>
          <span className="statement-line statement-line-accent">
            <span data-statement-word>&amp;</span>
            <span data-statement-word>Quick</span>
            <span data-statement-word>Battery</span>
            <span data-statement-word>Swaps.</span>
          </span>
        </h2>
        <p className="statement-copy">Safer, cleaner, and more affordable rides for your daily commute</p>
        <div className="statement-cycle" aria-label="Blinq mobility cycle">
          <div className="statement-cycle-track" aria-hidden="true"><span /></div>
          <div className="statement-cycle-steps">
            <span className="is-active" data-phase-step aria-current="step"><b>01</b>SWAP</span>
            <span data-phase-step><b>02</b>DRIVE</span>
            <span data-phase-step><b>03</b>REPEAT</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <main>
      <PillNav
        logo="/assets/blinq-mark.svg"
        logoAlt="Blinq"
        items={navItems}
        activeHref="#top"
        ease="power2.easeOut"
        baseColor="#D4FF00"
        pillColor="#10231F"
        hoveredPillTextColor="#10231F"
        pillTextColor="#F2F2ED"
        initialLoadAnimation
      />
      <Hero />
      <Statement />
      <BrandGrid />
      <section id="network" className="features-section" aria-label="How Blinq works">
        <FeatureStory />
      </section>
      <ProjectsSection />
      <BlinqFooter />
    </main>
  )
}

export default App

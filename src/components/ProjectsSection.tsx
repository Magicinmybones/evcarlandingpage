import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

type SquarePosition = [number, number, number]

type CaseStudy = {
  id: string
  title: string
  category: string
  metric: string
  image: string
  imageAlt: string
  squares: SquarePosition[]
}

const floatingSquares: SquarePosition[] = [
  [6, 20, 12], [12, 32, 8], [8, 44, 6], [88, 18, 10],
  [92, 30, 14], [85, 42, 7], [90, 52, 5], [14, 56, 5],
]

const caseStudies: CaseStudy[] = [
  {
    id: 'pre-seed-funding',
    title: '₹4.3 Cr for 4W Battery Swapping',
    category: 'Blinq announcement',
    metric: '2025',
    image: 'https://images.unsplash.com/photo-1732194191727-ba430678eda1?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Electric vehicle beside a modern charging station',
    squares: [[5, 30, 16], [10, 42, 10], [3, 52, 7], [80, 70, 14], [85, 82, 9], [78, 60, 6]],
  },
  {
    id: 'iit-startup-cohort',
    title: 'IIT Startup India Cohort 12',
    category: 'Achievement',
    metric: '2024',
    image: 'https://images.unsplash.com/photo-1758270705518-b61b40527e76?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Young innovators collaborating around a laptop',
    squares: [[82, 55, 16], [88, 68, 10], [78, 72, 7], [85, 42, 6], [90, 80, 8]],
  },
  {
    id: 'founder-journey',
    title: 'From Formula Student to Electric Pods',
    category: 'Founder story',
    metric: '2024',
    image: 'https://images.unsplash.com/photo-1757181470818-05fcb4052658?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Modern electric public transport moving through a city',
    squares: [[4, 24, 16], [10, 36, 10], [2, 44, 7], [78, 78, 14], [84, 88, 8]],
  },
  {
    id: 'battery-swapping',
    title: 'Battery Swapping: The Next EV Wave',
    category: 'Industry insight',
    metric: '2024',
    image: 'https://images.unsplash.com/photo-1744973179090-73ec820176e9?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Electric vehicle energy infrastructure at a station',
    squares: [[82, 26, 14], [88, 38, 10], [78, 44, 7], [84, 54, 5], [90, 60, 8]],
  },
]

function FloatingSquare({
  config,
  index,
  scrollProgress,
}: {
  config: SquarePosition
  index: number
  scrollProgress: MotionValue<number>
}) {
  const [x, y, size] = config
  const parallax = useTransform(scrollProgress, [0, 1], [0, -(80 + index * 30)])
  const smoothY = useSpring(parallax, { stiffness: 40, damping: 20 })

  return (
    <motion.span className="absolute" style={{ left: `${x}%`, top: `${y}%`, y: smoothY }}>
      <motion.span
        className="block bg-[#10231F]"
        style={{ width: size, height: size }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3 + index * 0.4,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
    </motion.span>
  )
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={cardRef}
      className="project-card group relative aspect-[4/3] overflow-hidden bg-[#DDE1D7]"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      <img
        src={study.image}
        alt={study.imageAlt}
        className="project-image absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />

      <span className="project-hover-wash pointer-events-none absolute inset-0 z-[5] bg-[#10231F]" aria-hidden="true" />

      {study.squares.map(([left, top, size], squareIndex) => (
        <span
          className="project-accent-square pointer-events-none absolute z-[8] bg-[#10231F]"
          key={`${study.id}-${squareIndex}`}
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
        />
      ))}

      <button
        type="button"
        className="project-open absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center border border-white/30 bg-transparent text-xs text-white"
        aria-label={`Open ${study.title} insight`}
      >
        +
      </button>

      <div className="project-info absolute bottom-0 left-0 z-20 max-w-[88%] bg-[#F2F2ED] px-4 pb-3 pt-2.5 sm:max-w-[70%]">
        <h3 className="m-0 text-[clamp(1.35rem,2.2vw,2rem)] font-normal leading-tight text-[#10231F]">{study.title}</h3>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono">
          <span className="text-[11px] text-[#10231F]/60">{study.category}</span>
          <span className="text-[11px] font-medium text-[#10231F]">{study.metric}</span>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerVisible = useInView(headerRef, { once: true, margin: '-60px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  return (
    <section id="projects" ref={sectionRef} className="projects-section relative bg-[#F2F2ED] font-display text-[#10231F]">
      <style>{`
        .project-image,
        .project-hover-wash,
        .project-accent-square,
        .project-open {
          transition:
            filter 280ms ease,
            opacity 280ms ease,
            color 220ms ease,
            background-color 220ms ease,
            border-color 220ms ease;
        }
        .project-hover-wash { opacity: 0; }
        .project-accent-square { opacity: 0.72; }
        @media (hover: hover) and (pointer: fine) {
          .project-card:hover .project-image {
            filter: saturate(0.9) brightness(0.94);
          }
          .project-card:hover .project-hover-wash { opacity: 0.055; }
          .project-card:hover .project-accent-square { opacity: 0.9; }
          .project-card:hover .project-open {
            border-color: rgba(212, 255, 0, 0.72);
            background: rgba(212, 255, 0, 0.12);
            color: #D4FF00;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-image,
          .project-hover-wash,
          .project-accent-square,
          .project-open {
            transition: none;
          }
        }
        @media (min-width: 768px) {
          .projects-section {
            height: 100vh;
            height: 100svh;
            height: 100dvh;
            min-height: 0;
            display: grid;
            grid-template-rows: auto minmax(0, 1fr);
            overflow: hidden;
          }
          .projects-top {
            padding-top: 6rem;
            padding-bottom: 0.75rem;
          }
          .projects-title {
            font-size: clamp(1.65rem, 2.7vw, 2.45rem);
          }
          .projects-cards {
            min-height: 0;
            padding-bottom: 0.75rem;
          }
          .projects-grid {
            height: 100%;
            grid-template-rows: repeat(2, minmax(0, 1fr));
            gap: 0.5rem;
          }
          .project-card {
            min-height: 0;
            aspect-ratio: auto;
          }
        }
        @media (min-width: 768px) and (max-height: 700px) {
          .projects-top {
            padding-top: 5.5rem;
            padding-bottom: 0.5rem;
          }
          .projects-title {
            font-size: clamp(1.45rem, 2.3vw, 2rem);
            line-height: 1.08;
          }
          .projects-badge {
            margin-bottom: 0.5rem;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
        }
        @media (max-width: 420px) {
          .project-info {
            max-width: 92%;
          }
        }
      `}</style>

      <div className="projects-top relative px-6 pb-10 pt-[clamp(5.5rem,12vh,10rem)] sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {floatingSquares.map((square, index) => (
            <FloatingSquare key={`${square.join('-')}-${index}`} config={square} index={index} scrollProgress={scrollYProgress} />
          ))}
        </div>

        <motion.div
          ref={headerRef}
          className="relative mx-auto max-w-7xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="projects-badge mb-3 inline-block bg-[#10231F] px-4 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-white">LATEST INSIGHTS</span>
          <h2 className="projects-title m-0 text-[clamp(1.9rem,3.4vw,3.1rem)] font-medium leading-[1.18] tracking-[-0.035em]">
            <span className="text-[#10231F]">From the </span><span className="text-[#10231F]/40">Blinq</span>
            <br />
            <span className="text-[#10231F]/40">Mobility Journal</span>
          </h2>
        </motion.div>
      </div>

      <div className="projects-cards mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 lg:px-16">
        <div className="projects-grid grid gap-4 md:grid-cols-2">
          {caseStudies.map((study, index) => <CaseStudyCard key={study.id} study={study} index={index} />)}
        </div>
      </div>

    </section>
  )
}

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, type KeyboardEvent, type MouseEvent } from 'react'

const faqs = [
  {
    question: 'How long does a battery swap take?',
    answer: 'A standard Blinq swap takes about 90 seconds. You remain inside the vehicle while the station removes, checks, and replaces the battery pack.',
  },
  {
    question: 'Will Blinq work with my vehicle?',
    answer: 'Compatibility depends on the vehicle platform and battery architecture. The Blinq app confirms compatibility before you reserve a station bay.',
  },
  {
    question: 'Can I reserve a station before arriving?',
    answer: 'Yes. Your vehicle or the Blinq app can reserve a bay along your route so a charged pack is prepared before you arrive.',
  },
  {
    question: 'How do you protect battery health?',
    answer: 'Every returned pack is inspected, health-scored, and recharged slowly during off-peak hours before it returns to circulation.',
  },
  {
    question: 'Does Blinq support commercial fleets?',
    answer: 'Yes. Fleet programs include planned swap capacity, route integration, battery reporting, and operating support tailored to each depot or network.',
  },
]

const footerGroups = [
  {
    title: 'Explore',
    links: [['Station', '#station'], ['How it works', '#about'], ['Network', '#network'], ['Insights', '#projects']],
  },
  {
    title: 'Company',
    links: [['About Blinq', '#about'], ['Fleet programs', '#network'], ['Contact', 'mailto:hello@blinq.energy']],
  },
] as const

export default function BlinqFooter() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setActiveIndex((current) => current === index ? null : index)
  }

  const handleFaqKey = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(index)
    }
  }

  const raiseShadow = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.3)'
  }

  const lowerShadow = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.22)'
  }

  return (
    <section id="contact" className="bg-[#F2F2ED] font-display text-[#10231F]">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 sm:px-10 sm:pt-20 lg:px-16" aria-hidden="true">
        <div className="relative flex items-center justify-between border-t border-[#10231F]/20 pt-4 font-mono text-[9px] tracking-[0.2em] text-[#10231F]/45 sm:text-[10px]">
          <span className="absolute -top-1 left-[18%] h-2 w-2 bg-[#D4FF00] ring-4 ring-[#F2F2ED]" />
          <span>04 / INSIGHTS</span>
          <span>NEXT / QUESTIONS</span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 sm:px-10 lg:px-16 max-[900px]:pb-[60px] max-[900px]:pt-10">
        <div className="grid grid-cols-[1.6fr_1fr] items-stretch gap-[30px] max-[900px]:grid-cols-1 max-[900px]:gap-[60px]">
          <div
            className="c5-animated-gradient flex min-h-[560px] flex-col items-center justify-center rounded-[24px] px-10 py-20 text-center text-[#F2F2ED] max-[900px]:min-h-[480px] max-[600px]:min-h-[420px] max-[600px]:px-6"
            style={{ boxShadow: '0 10px 30px rgba(7, 18, 15, 0.12)' }}
          >
            <span className="mb-5 font-mono text-[11px] tracking-[0.22em] text-[#D4FF00]">READY WHEN YOU ARE</span>
            <h2 className="mb-[15px] mt-0 text-[clamp(2.65rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.055em]">
              Leave charging.<br />Keep moving.
            </h2>
            <p className="mb-[30px] mt-0 max-w-md text-[1rem] font-normal leading-[1.6] text-[#F2F2ED]/75">
              Find a Blinq station, reserve your bay, and leave with a certified battery in about ninety seconds.
            </p>
            <button
              type="button"
              className="cursor-pointer border-0 bg-[#F2F2ED] text-[0.95rem] font-semibold text-[#10231F] transition-all duration-200 hover:-translate-y-0.5"
              style={{ padding: '14px 32px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.22)' }}
              onMouseEnter={raiseShadow}
              onMouseLeave={lowerShadow}
              onClick={() => { window.location.hash = 'station' }}
            >
              Find a station
            </button>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <div className="mb-5">
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#10231F]/55">QUESTIONS, ANSWERED</span>
              <h2 className="mb-0 mt-3 text-[clamp(2rem,3vw,3rem)] font-medium leading-[1.05] tracking-[-0.045em]">Before your first swap</h2>
            </div>
            {faqs.map((faq, index) => {
              const active = activeIndex === index
              return (
                <div
                  key={faq.question}
                  role="button"
                  tabIndex={0}
                  aria-expanded={active}
                  className="cursor-pointer rounded-[10px] border bg-white px-5 py-[18px] transition-all duration-200 hover:border-[#C8CEC4]"
                  style={{
                    borderColor: active ? '#C8CEC4' : '#DDE1D7',
                    boxShadow: active ? '0 4px 12px rgba(16,35,31,0.08)' : '0 2px 8px rgba(16,35,31,0.035)',
                  }}
                  onClick={() => toggle(index)}
                  onKeyDown={(event) => handleFaqKey(event, index)}
                >
                  <div className="flex items-center justify-between gap-4 text-[0.9rem] font-medium text-[#10231F]">
                    <span>{faq.question}</span>
                    {active ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
                  </div>
                  {active && <div className="mt-3 text-[0.9rem] leading-[1.6] text-[#4A554F]">{faq.answer}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="bg-[#07120F] pb-5 pt-20 text-[#F2F2ED] max-[900px]:pt-[60px]">
        <div className="mx-auto w-full max-w-[1100px] px-5">
          <div className="mb-[50px] grid grid-cols-[2fr_1fr_1fr_2fr] gap-10 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
            <div>
              <a href="#top" className="mb-[15px] inline-flex items-center gap-3 text-[#F2F2ED]" aria-label="Blinq home">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D4FF00] p-1.5">
                  <img src="/assets/blinq-mark.svg" alt="" className="h-full w-full" />
                </span>
                <span className="text-xl font-semibold tracking-[-0.03em]">blinq</span>
              </a>
              <p className="m-0 max-w-[240px] text-[0.85rem] leading-[1.6] text-[#F2F2ED]/55">Battery swapping that keeps drivers, fleets, and clean energy moving.</p>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-5 mt-0 text-[0.95rem] font-semibold text-[#F2F2ED]">{group.title}</h3>
                <ul className="m-0 list-none p-0">
                  {group.links.map(([label, href]) => (
                    <li key={label} className="mb-3">
                      <a href={href} className="text-[0.85rem] text-[#F2F2ED]/55 no-underline transition-colors duration-200 hover:text-[#D4FF00]">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-5 mt-0 text-[0.95rem] font-semibold text-[#F2F2ED]">The Blinq signal</h3>
              <p className="mb-[15px] mt-0 text-[0.85rem] text-[#F2F2ED]/55">Station openings, vehicle support, and network updates.</p>
              <form className="flex gap-[10px] max-[560px]:flex-col" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="min-w-0 flex-grow border border-white/10 bg-white/5 text-[0.9rem] text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#D4FF00]/70"
                  style={{ padding: '12px 16px', borderRadius: '10px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}
                />
                <button
                  type="submit"
                  className="cursor-pointer border-0 bg-[#D4FF00] text-[0.9rem] font-semibold text-[#07120F] transition-all duration-200 hover:-translate-y-0.5"
                  style={{ padding: '12px 24px', borderRadius: '10px', boxShadow: '0 12px 24px rgba(0,0,0,0.28)' }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="mx-auto mt-8 w-full max-w-[1400px] overflow-hidden border-t border-white/10 px-5 pb-12 pt-12 sm:mt-12 sm:pt-16">
          <p className="sr-only">Swap. Drive. Repeat.</p>
          <div className="font-display text-[clamp(4.5rem,11.5vw,11rem)] font-medium uppercase leading-[0.74] tracking-[-0.08em]" aria-hidden="true">
            <span className="block text-left text-[#F2F2ED]">SWAP</span>
            <span className="block text-center text-[#F2F2ED]/38">DRIVE</span>
            <span className="block text-right text-[#D4FF00]">REPEAT</span>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1100px] justify-between border-t border-white/10 px-5 pb-[10px] pt-[25px] font-mono text-[0.72rem] text-[#F2F2ED]/45 max-[480px]:flex-col max-[480px]:items-center max-[480px]:gap-[15px]">
          <span>© 2026 Blinq. All rights reserved.</span>
          <span>Energy without the wait.</span>
        </div>
      </footer>
    </section>
  )
}

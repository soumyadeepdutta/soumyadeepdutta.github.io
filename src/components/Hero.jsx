import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  stagger,
} from 'motion/react'
import styles from './Hero.module.css'
import RollingLabel from './RollingLabel'
import DeskSketch from './DeskSketch'
import HandwrittenText from './HandwrittenText'
import { revealTransition } from './MotionReveal'
import { onDeskDrawStart } from '../utils/introChoreography'

const RESUME_HREF = 'https://www.linkedin.com/in/soumyadeep-dutta/'
const WRITE_HREF = 'mailto:imsoumyadeepdutta@gmail.com'

const PROOF = [
  { value: '5+ yrs', label: 'shipping' },
  { value: '700k+', label: 'req/day' },
  { value: '10M+', label: 'events' },
]

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  },
}

const noteTextItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

function MagneticCta({
  href,
  className,
  ariaLabel,
  onClick,
  target,
  rel,
  children,
}) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const handleMove = (event) => {
    if (prefersReduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    x.set(dx * 0.22)
    y.set(dy * 0.22)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      style={prefersReduced ? undefined : { x: springX, y: springY }}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </motion.a>
  )
}

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const [contentReady, setContentReady] = useState(() => !!prefersReduced)

  useEffect(() => {
    if (prefersReduced) {
      setContentReady(true)
      return undefined
    }
    return onDeskDrawStart(() => setContentReady(true))
  }, [prefersReduced])

  const showCopy = prefersReduced || contentReady

  return (
    <section className={styles.hero} id="about">
      <div className={`container ${styles.inner}`}>
        <motion.div
          className={styles.content}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.07) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          animate={showCopy ? 'show' : 'hidden'}
        >
          <HandwrittenText
            className={styles.hand}
            active={showCopy}
            delay={0.02}
          >
            Hi. I build the quiet parts of products.
          </HandwrittenText>

          <motion.h1 className={styles.name} variants={heroItem}>
            <span className={styles.nameLine}>
              <motion.span
                className={styles.nameWord}
                initial={prefersReduced ? false : { y: '115%' }}
                animate={showCopy ? { y: '0%' } : { y: '115%' }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        visualDuration: 0.5,
                        bounce: 0,
                        delay: 0.06,
                      }
                }
              >
                Soumyadeep
              </motion.span>
            </span>
            <span className={styles.nameLine}>
              <motion.span
                className={styles.nameWord}
                initial={prefersReduced ? false : { y: '115%' }}
                animate={showCopy ? { y: '0%' } : { y: '115%' }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        visualDuration: 0.5,
                        bounce: 0,
                        delay: 0.14,
                      }
                }
              >
                Dutta
              </motion.span>
            </span>
          </motion.h1>

          <motion.p className={styles.role} variants={heroItem}>
            Backend engineer · Node.js + AWS · fintech, healthcare, SaaS
          </motion.p>

          <motion.p className={styles.bio} variants={heroItem}>
            Five years making Node.js and AWS stacks hold up under real load.
            Fintech traffic, healthcare APIs, SaaS backends. On the side I build
            MCP servers and a local RAG system, because the quiet parts of
            products keep getting smarter.
          </motion.p>

          <motion.div className={styles.ctaRow} variants={heroItem}>
            <MagneticCta
              href={RESUME_HREF}
              className={styles.ctaPrimary}
              ariaLabel="Resume"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RollingLabel>Resume</RollingLabel>
            </MagneticCta>
            <MagneticCta
              href={WRITE_HREF}
              className={styles.ctaSecondary}
              ariaLabel="Write me"
            >
              <RollingLabel>Write me</RollingLabel>
            </MagneticCta>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.noteStage}
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          animate={
            showCopy ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
          }
          transition={
            prefersReduced
              ? { duration: 0 }
              : { type: 'spring', visualDuration: 0.55, bounce: 0 }
          }
        >
          <motion.aside
            className={styles.noteCard}
            aria-label="A note from the desk"
            animate={prefersReduced ? undefined : { y: [0, -8, 0] }}
            transition={
              prefersReduced
                ? undefined
                : {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: showCopy ? 0.9 : 0,
                  }
            }
          >
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { delayChildren: stagger(0.08) } },
              }}
              initial={prefersReduced ? false : 'hidden'}
              animate={showCopy ? 'show' : 'hidden'}
            >
              <HandwrittenText
                className={styles.noteHand}
                active={showCopy}
                delay={0.18}
              >
                a note from the desk
              </HandwrittenText>
              <DeskSketch />
              <motion.p className={styles.noteBody} variants={noteTextItem}>
                Most days I am chasing a queue that should have drained an hour ago,
                or watching Athena turn a messy log lake into something a human can
                query. I like that kind of problem.
              </motion.p>
              <motion.div
                className={styles.proofRow}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      delayChildren: stagger(0.08, { startDelay: 0.12 }),
                    },
                  },
                }}
              >
                {PROOF.map((item) => (
                  <motion.div
                    key={item.label}
                    className={styles.proofChip}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: revealTransition,
                      },
                    }}
                  >
                    <span className={styles.proofValue}>{item.value}</span>
                    <span className={`mono ${styles.proofLabel}`}>{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  )
}

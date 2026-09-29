import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  stagger,
} from 'motion/react'
import styles from './Hero.module.css'
import RollingLabel from './RollingLabel'
import DeskSketch, { DESK_DRAW_DURATION } from './DeskSketch'
import HandwrittenText from './HandwrittenText'
import {
  follow,
  idleFloat,
  instant,
  revealItem,
  spring,
} from '../utils/motionTokens'
import { STORY, onLandingStart } from '../utils/introChoreography'

const RESUME_HREF = 'https://www.linkedin.com/in/soumyadeep-dutta/'
const WRITE_HREF = 'mailto:imsoumyadeepdutta@gmail.com'

const PROOF = [
  { value: '5+ yrs', label: 'shipping' },
  { value: '23', label: 'AMCs served' },
  { value: '~₹1 Cr', label: 'a day' },
]

const noteTextItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: spring.reveal,
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
  const springX = useSpring(x, follow.magnetic)
  const springY = useSpring(y, follow.magnetic)

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
  const noteRef = useRef(null)
  const noteInView = useInView(noteRef, { once: true, amount: 0.35 })
  const [landedAt, setLandedAt] = useState(() =>
    prefersReduced ? 0 : null
  )
  const [cardDelay, setCardDelay] = useState(null)
  const [noteTextReady, setNoteTextReady] = useState(() => !!prefersReduced)
  const [deskDrawn, setDeskDrawn] = useState(() => !!prefersReduced)

  // Act 3: the nav hands over — headline copy starts now.
  useEffect(() => {
    if (prefersReduced) {
      setLandedAt(0)
      return undefined
    }
    return onLandingStart(() => setLandedAt(performance.now()))
  }, [prefersReduced])

  // Act 4: the card rises once we have landed AND it is on screen. If it was
  // already visible it waits its turn after the headline; if the visitor
  // scrolls to it later it starts right away.
  useEffect(() => {
    if (landedAt === null || !noteInView || cardDelay !== null) return
    const sinceLanding = (performance.now() - landedAt) / 1000
    setCardDelay(Math.max(0, STORY.desk.cardAt - sinceLanding))
  }, [landedAt, noteInView, cardDelay])

  const showCopy = prefersReduced || landedAt !== null
  const showCard = prefersReduced || cardDelay !== null
  const deskDelay = (cardDelay ?? 0) + STORY.desk.drawAfterCard

  // Note text and chips arrive as the last strokes land, not before.
  useEffect(() => {
    if (prefersReduced || cardDelay === null) return undefined
    const at = deskDelay + DESK_DRAW_DURATION - STORY.desk.textLeadIn
    const timer = window.setTimeout(() => setNoteTextReady(true), at * 1000)
    return () => window.clearTimeout(timer)
  }, [prefersReduced, cardDelay, deskDelay])

  return (
    <section className={styles.hero} id="about">
      <div className={`container ${styles.inner}`}>
        <motion.div
          className={styles.content}
          variants={{
            hidden: {},
            show: {
              transition: { delayChildren: stagger(STORY.headline.stagger) },
            },
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

          <motion.h1 className={styles.name} variants={revealItem}>
            <span className={styles.nameLine}>
              <motion.span
                className={styles.nameWord}
                initial={prefersReduced ? false : { y: '115%' }}
                animate={showCopy ? { y: '0%' } : { y: '115%' }}
                transition={
                  prefersReduced ? instant : { ...spring.slow, delay: 0.06 }
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
                  prefersReduced ? instant : { ...spring.slow, delay: 0.14 }
                }
              >
                Dutta
              </motion.span>
            </span>
          </motion.h1>

          <motion.p className={styles.role} variants={revealItem}>
            Backend engineer at KFin Technologies · Node.js, Python, AWS
          </motion.p>

          <motion.p className={styles.bio} variants={revealItem}>
            Five years in backend. Today I run production AWS for LAMF, a
            loan-against-mutual-fund platform used by 23 AMCs that moves close
            to ₹1 crore a day. On the side I build MCP servers and a local RAG
            system, because the quiet parts of products keep getting smarter.
          </motion.p>

          <motion.div className={styles.ctaRow} variants={revealItem}>
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
          ref={noteRef}
          className={styles.noteStage}
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={
            prefersReduced ? instant : { ...spring.slow, delay: cardDelay ?? 0 }
          }
        >
          <motion.aside
            className={styles.noteCard}
            aria-label="A note from the desk"
            // Idle float only once the drawing is finished, so the pen's
            // lines never drift while they are being drawn.
            animate={
              prefersReduced || !deskDrawn ? { y: 0 } : { y: idleFloat.y }
            }
            transition={
              prefersReduced || !deskDrawn
                ? instant
                : idleFloat.transition
            }
          >
            {/* single child keeps the card's existing spacing */}
            <div>
              <HandwrittenText
                className={styles.noteHand}
                active={showCard}
                delay={(cardDelay ?? 0) + STORY.desk.captionAfterCard}
              >
                a note from the desk
              </HandwrittenText>
              <DeskSketch
                play={showCard}
                delay={deskDelay}
                onDrawn={() => setDeskDrawn(true)}
              />
              <motion.div
                variants={{
                  hidden: {},
                  show: { transition: { delayChildren: stagger(0.08) } },
                }}
                initial={prefersReduced ? false : 'hidden'}
                animate={noteTextReady ? 'show' : 'hidden'}
              >
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
                          transition: spring.reveal,
                        },
                      }}
                    >
                      <span className={styles.proofValue}>{item.value}</span>
                      <span className={`mono ${styles.proofLabel}`}>{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  )
}

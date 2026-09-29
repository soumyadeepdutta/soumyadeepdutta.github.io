import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import TransitionLink from './TransitionLink'
import { blogs } from '../data/blogs'
import styles from './Blog.module.css'
import { blogTitleTransitionName } from '../utils/viewTransitions'
import {
  respond,
  revealItem,
  rhythm,
  spring,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

const gridGroup = staggerGroup(rhythm.cards)

export default function BlogList() {
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main id="main">
      <section className={styles.blogContainer}>
        <div className="container">
          <div className={styles.blogHeader}>
            <h1>Blog</h1>
            <p>Notes on pipelines, AWS, and the systems behind them.</p>
          </div>

          <motion.div
            className={styles.blogGrid}
            variants={gridGroup}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={viewport.group}
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.slug}
                className={styles.blogItem}
                variants={revealItem}
                whileHover={reduce ? undefined : respond.lift}
                transition={spring.hover}
              >
                <TransitionLink to={`/blog/${blog.slug}`} className={styles.blogCard}>
                  {blog.image && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={blog.image}
                        alt=""
                        className={styles.blogImage}
                        width="640"
                        height="200"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className={styles.blogDate}>
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <h2
                    className={styles.blogTitle}
                    style={{ viewTransitionName: blogTitleTransitionName(blog.slug) }}
                  >
                    {blog.title}
                  </h2>
                  <p className={styles.blogSummary}>{blog.summary}</p>
                  <div className={styles.tags}>
                    {blog.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </TransitionLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}

import { useEffect } from 'react'
import TransitionLink from './TransitionLink'
import { blogs } from '../data/blogs'
import styles from './Blog.module.css'
import { blogTitleTransitionName } from '../utils/viewTransitions'

export default function BlogList() {
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

          <div className={styles.blogGrid}>
            {blogs.map((blog) => (
              <TransitionLink to={`/blog/${blog.slug}`} key={blog.slug} className={styles.blogCard}>
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
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

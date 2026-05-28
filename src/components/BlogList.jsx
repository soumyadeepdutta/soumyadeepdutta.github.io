import { Link } from 'react-router-dom'
import { blogs } from '../data/blogs'
import styles from './Blog.module.css'
import { useEffect } from 'react'

export default function BlogList() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className={styles.blogContainer}>
      <div className="container">
        <div className={styles.blogHeader}>
          <h1>Blog</h1>
          <p>Thoughts on software engineering, cloud architecture, and more.</p>
        </div>
        
        <div className={styles.blogGrid}>
          {blogs.map((blog) => (
            <Link to={`/blog/${blog.slug}`} key={blog.slug} className={styles.blogCard}>
              {blog.image && (
                <div className={styles.imageWrapper}>
                  <img src={blog.image} alt={blog.title} className={styles.blogImage} />
                </div>
              )}
              <div className={styles.blogDate}>
                {new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h2 className={styles.blogTitle}>{blog.title}</h2>
              <p className={styles.blogSummary}>{blog.summary}</p>
              <div className={styles.tags}>
                {blog.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

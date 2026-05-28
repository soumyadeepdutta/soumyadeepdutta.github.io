import { useParams, Link, useNavigate } from 'react-router-dom'
import { blogs } from '../data/blogs'
import styles from './Blog.module.css'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(b => b.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!blog) {
    return (
      <section className={styles.postContainer}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Blog post not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/blog')} style={{ marginTop: '2rem' }}>
            Back to Blog
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.postContainer}>
      <div className="container">
        <Link to="/blog" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to all posts
        </Link>
        
        <h1 className={styles.postTitle}>{blog.title}</h1>
        
        <div className={styles.postMeta}>
          <div className={styles.blogDate}>
            {new Date(blog.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className={styles.tags}>
            {blog.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.postContent}>
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}

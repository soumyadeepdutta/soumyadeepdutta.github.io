import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { blogs } from '../data/blogs'
import styles from './Blog.module.css'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Mermaid from './Mermaid'
import TransitionLink from './TransitionLink'
import { blogTitleTransitionName, isModifiedClick, navigateTyped } from '../utils/viewTransitions'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const blog = blogs.find(b => b.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!blog) {
    return (
      <main id="main">
        <section className={styles.postContainer}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>Blog post not found</h2>
            <p className={styles.notFoundHint}>That slug is not in the archive. Return to the list to pick another post.</p>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                if (isModifiedClick(e)) return
                navigateTyped(navigate, '/blog', location.pathname)
              }}
              style={{ marginTop: '2rem' }}
            >
              Back to Blog
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main id="main">
      <section className={styles.postContainer}>
        <div className="container">
          <TransitionLink to="/blog" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to all posts
          </TransitionLink>

          <h1
            className={styles.postTitle}
            style={{ viewTransitionName: blogTitleTransitionName(blog.slug) }}
          >
            {blog.title}
          </h1>

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
            <ReactMarkdown
              components={{
                code(props) {
                  const {children, className, node, ...rest} = props
                  const match = /language-(\w+)/.exec(className || '')
                  if (match && match[1] === 'mermaid') {
                    return <Mermaid chart={String(children).replace(/\n$/, '')} />
                  }
                  return <code {...rest} className={className}>{children}</code>
                }
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  )
}

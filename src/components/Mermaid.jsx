import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import styles from './Blog.module.css'

export default function Mermaid({ chart }) {
  const containerRef = useRef(null)
  const [svgContent, setSvgContent] = useState('')
  const [error, setError] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(
    typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') || 'dark' : 'dark'
  )

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setCurrentTheme(document.documentElement.getAttribute('data-theme') || 'dark')
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let isMounted = true

    const renderChart = async () => {
      try {
        setError(false)
        mermaid.initialize({
          startOnLoad: false,
          theme: currentTheme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose', // Needed if we want to support click events, but strict is safer. Loose is okay for static site
        })

        // Generate a unique ID for the mermaid diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        
        const { svg } = await mermaid.render(id, chart)
        
        if (isMounted) {
          setSvgContent(svg)
        }
      } catch (err) {
        console.error('Mermaid rendering failed:', err)
        if (isMounted) {
          setError(true)
        }
      }
    }

    if (chart) {
      renderChart()
    }

    return () => {
      isMounted = false
    }
  }, [chart, currentTheme])

  if (error) {
    return (
      <div className={styles.mermaidError}>
        <p>Failed to render diagram. Raw code:</p>
        <pre><code>{chart}</code></pre>
      </div>
    )
  }

  return (
    <div 
      className={styles.mermaidWrapper} 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  )
}

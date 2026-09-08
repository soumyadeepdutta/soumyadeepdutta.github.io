import styles from './Navbar.module.css'

export default function ThemeToggle({
  theme,
  toggleTheme,
  className = '',
  tabIndex,
}) {
  const next = theme === 'dark' ? 'light' : 'dark'
  const label = theme === 'dark' ? 'Light' : 'Dark'

  return (
    <button
      type="button"
      className={`${styles.themeToggle} ${className}`.trim()}
      onClick={(e) => {
        e.stopPropagation()
        toggleTheme()
      }}
      tabIndex={tabIndex}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {label}
    </button>
  )
}

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isModifiedClick, navigateTyped } from '../utils/viewTransitions'

/**
 * In-app link that triggers a typed view transition (forward into a deeper
 * route, back when climbing out). Falls back to a normal navigation when
 * the click is modified or the user prefers reduced motion.
 */
export default function TransitionLink({ to, onClick, children, ...rest }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Link
      to={to}
      viewTransition
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || isModifiedClick(event)) return
        event.preventDefault()
        navigateTyped(navigate, to, location.pathname)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}

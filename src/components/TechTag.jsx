import { getTechIcon, getTechLabel, resolveTechIconKey } from './techIcons'
import { skillTransitionName } from '../utils/viewTransitions'

const COLOR_MAP = {
  accent: 'tag',
  blue: 'tag tag-blue',
  green: 'tag tag-green',
  purple: 'tag tag-purple',
}

export default function TechTag({
  item,
  color = 'accent',
  className = '',
  onSelect,
  active = false,
  shared = false,
}) {
  const label = getTechLabel(item)
  const Icon = getTechIcon(resolveTechIconKey(item))
  const tagClass = COLOR_MAP[color] || 'tag'
  const Comp = onSelect ? 'button' : 'span'

  return (
    <Comp
      type={onSelect ? 'button' : undefined}
      className={`${tagClass} tag-with-icon ${className}`.trim()}
      aria-pressed={onSelect ? active : undefined}
      onClick={onSelect ? () => onSelect(label) : undefined}
      onFocus={onSelect ? () => onSelect(label) : undefined}
      style={shared && active ? { viewTransitionName: skillTransitionName(label) } : undefined}
    >
      {Icon ? <Icon className="tag-icon" size={16} aria-hidden="true" /> : null}
      <span className="tag-label">{label}</span>
    </Comp>
  )
}

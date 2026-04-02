import { getTechIcon, getTechLabel, resolveTechIconKey } from './techIcons'

const COLOR_MAP = {
  accent: 'tag',
  blue: 'tag tag-blue',
  green: 'tag tag-green',
  purple: 'tag tag-purple',
}

export default function TechTag({ item, color = 'accent', className = '' }) {
  const label = getTechLabel(item)
  const Icon = getTechIcon(resolveTechIconKey(item))
  const tagClass = COLOR_MAP[color] || 'tag'

  return (
    <span className={`${tagClass} tag-with-icon ${className}`.trim()}>
      {Icon ? <Icon className="tag-icon" size={16} aria-hidden="true" /> : null}
      <span className="tag-label">{label}</span>
    </span>
  )
}
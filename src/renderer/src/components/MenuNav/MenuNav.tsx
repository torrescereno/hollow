import React from 'react'
import type { LucideIcon } from 'lucide-react'
import type { MenuTab } from '../../schemas'

interface MenuNavProps {
  activeTab: MenuTab
  onTabChange: (tab: MenuTab) => void
  items: Array<{ key: MenuTab; label: string; Icon: LucideIcon }>
}

export function MenuNav({ activeTab, onTabChange, items }: MenuNavProps): React.JSX.Element {
  return (
    <nav className="app-no-drag nav-menu">
      {items.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`nav-item ${activeTab === key ? 'active' : 'inactive'}`}
        >
          <Icon size={15} strokeWidth={1.5} />
          {label}
        </button>
      ))}
    </nav>
  )
}

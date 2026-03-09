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
    <nav className="app-no-drag flex flex-col gap-1">
      {items.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-[0.025em] transition-all duration-200 ${
            activeTab === key
              ? 'bg-white/8 text-text-main'
              : 'text-white/35 hover:text-white/65 hover:bg-white/4'
          }`}
        >
          <Icon size={15} strokeWidth={1.5} />
          {label}
        </button>
      ))}
    </nav>
  )
}

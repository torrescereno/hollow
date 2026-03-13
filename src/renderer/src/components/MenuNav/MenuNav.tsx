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
      {items.map(({ key, label, Icon }) => {
        const isActive = activeTab === key

        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-[0.025em] transition-colors duration-200 focus-ring
              ${
                isActive
                  ? 'bg-white/8 text-text-main'
                  : 'text-white/25 hover:text-white/50 hover:bg-white/5'
              }`}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

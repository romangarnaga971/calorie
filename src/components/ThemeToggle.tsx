'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10"></div>
  }

  return (
    <div className="flex bg-(--input) p-1 rounded-xl">
      <button
        onClick={() => setTheme('light')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-(--card) shadow-sm text-(--accent)' : 'text-(--foreground) opacity-70 hover:opacity-100'}`}
      >
        <Sun className="w-4 h-4" />
        Світла
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-(--card) shadow-sm text-(--accent)' : 'text-(--foreground) opacity-70 hover:opacity-100'}`}
      >
        <Moon className="w-4 h-4" />
        Темна
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'system' ? 'bg-(--card) shadow-sm text-(--accent)' : 'text-(--foreground) opacity-70 hover:opacity-100'}`}
      >
        <Monitor className="w-4 h-4" />
        Авто
      </button>
    </div>
  )
}

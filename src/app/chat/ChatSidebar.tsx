'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, MessageSquare, Trash2, ArrowLeft, Menu, X } from 'lucide-react'

type Session = {
  id: string
  title: string
  updated_at: string
}

export default function ChatSidebar({ 
  sessions, 
  isLimitReached, 
  createAction, 
  deleteAction 
}: { 
  sessions: Session[] | null
  isLimitReached: boolean
  createAction: () => void
  deleteAction: (id: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Header Toggle */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-(--border) bg-(--card)">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 -ml-2 bg-(--input) rounded-full">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold">AI Консультант</span>
        </div>
        <form action={createAction}>
          <button 
            type="submit"
            disabled={isLimitReached}
            className={`p-2 rounded-full ${isLimitReached ? 'bg-(--input) opacity-50' : 'bg-(--accent) text-(--accent-foreground)'}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </header>

      {/* Desktop Toggle Button (when closed) */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar} 
          className="hidden md:flex absolute top-4 left-4 z-50 p-2 bg-(--card) border border-(--border) rounded-xl shadow-sm hover:bg-(--input) transition-colors"
        >
          <Menu className="w-5 h-5 text-(--foreground)" />
        </button>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 h-full w-72 md:w-64 border-r border-(--border) bg-(--card) flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        }`}
      >
        <div className="p-4 border-b border-(--border)">
          <div className="flex items-center justify-between mb-6">
            <Link href="/diary" className="flex items-center gap-2 text-(--foreground) hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Назад</span>
            </Link>
            
            <button onClick={toggleSidebar} className="p-1 hover:bg-(--input) rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form action={createAction}>
            <button 
              type="submit"
              disabled={isLimitReached}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                isLimitReached 
                  ? 'bg-(--input) text-(--foreground) opacity-50 cursor-not-allowed' 
                  : 'bg-(--accent) text-(--accent-foreground) hover:opacity-90 shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4" />
              Новий чат
            </button>
          </form>
          {isLimitReached && (
            <p className="text-[10px] text-red-500 mt-2 text-center">Ліміт: 5 чатів. Видаліть старий.</p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions?.map(session => (
            <div key={session.id} className="group relative flex items-center">
              <Link 
                href={`/chat/${session.id}`}
                onClick={() => setIsOpen(false)} // Close on mobile when selecting
                className="flex-1 flex items-center gap-3 p-3 rounded-xl hover:bg-(--input) transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4 opacity-50 shrink-0" />
                <span className="truncate flex-1">{session.title}</span>
              </Link>
              
              <form action={() => deleteAction(session.id)} className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="submit" className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
          {(!sessions || sessions.length === 0) && (
            <div className="text-center opacity-50 text-sm mt-10">
              Немає історій розмов.
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

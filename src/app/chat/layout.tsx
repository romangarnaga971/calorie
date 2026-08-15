import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, MessageSquare, Trash2, ArrowLeft } from 'lucide-react'
import { createChatSession, deleteChatSession } from './actions'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch chat sessions
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('id, title, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const isLimitReached = (sessions?.length || 0) >= 5

  return (
    <div className="flex h-screen overflow-hidden bg-(--background) animate-in">
      {/* Sidebar (Desktop & Tablet) */}
      <aside className="w-64 border-r border-(--border) bg-(--card) hidden md:flex flex-col">
        <div className="p-4 border-b border-(--border)">
          <Link href="/diary" className="flex items-center gap-2 text-(--foreground) hover:opacity-80 transition-opacity mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Назад до щоденника</span>
          </Link>
          
          <form action={createChatSession}>
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
            <p className="text-[10px] text-red-500 mt-2 text-center">Ліміт: 5 чатів. Видаліть старий, щоб створити новий.</p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions?.map(session => (
            <div key={session.id} className="group relative flex items-center">
              <Link 
                href={`/chat/${session.id}`}
                className="flex-1 flex items-center gap-3 p-3 rounded-xl hover:bg-(--input) transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4 opacity-50" />
                <span className="truncate flex-1">{session.title}</span>
              </Link>
              
              <form action={deleteChatSession.bind(null, session.id)} className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-(--border) bg-(--card)">
          <div className="flex items-center gap-3">
            <Link href="/diary" className="p-2 -ml-2 bg-(--input) rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-semibold">AI Консультант</span>
          </div>
          <form action={createChatSession}>
            <button 
              type="submit"
              disabled={isLimitReached}
              className={`p-2 rounded-full ${isLimitReached ? 'bg-(--input) opacity-50' : 'bg-(--accent) text-(--accent-foreground)'}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </header>

        {children}
      </main>
    </div>
  )
}

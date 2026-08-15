import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createChatSession, deleteChatSession } from './actions'
import ChatSidebar from './ChatSidebar'

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
    <div className="flex h-screen overflow-hidden bg-(--background) animate-in relative">
      <ChatSidebar 
        sessions={sessions || []}
        isLimitReached={isLimitReached}
        createAction={createChatSession}
        deleteAction={deleteChatSession}
      />
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { createChatSession, deleteChatSession } from './actions'
import ChatSidebar from './ChatSidebar'
import { useUser, useChatSessions } from '@/hooks/useSupabase'
import { Loader2 } from 'lucide-react'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: sessions, isLoading: isSessionsLoading } = useChatSessions()

  if (isUserLoading || isSessionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[100dvh]">
        <Loader2 className="w-8 h-8 animate-spin text-(--accent) opacity-50" />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }



  const isLimitReached = (sessions?.length || 0) >= 5

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-(--background) animate-in relative">
      <ChatSidebar 
        sessions={sessions || []}
        isLimitReached={isLimitReached}
        createAction={createChatSession}
        deleteAction={deleteChatSession}
      />
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        {children}
      </main>
    </div>
  )
}

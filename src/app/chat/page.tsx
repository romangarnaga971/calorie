'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useChatSessions, useUser } from '@/hooks/useSupabase'
import { Loader2 } from 'lucide-react'
import { createChatSession } from './actions'

export default function ChatIndexPage() {
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: sessions, isLoading: isSessionsLoading } = useChatSessions()

  useEffect(() => {
    if (isUserLoading || isSessionsLoading) return
    
    if (!user) {
      router.replace('/login')
      return
    }

    if (sessions && sessions.length > 0) {
      router.replace(`/chat/${sessions[0].id}`)
    } else {
      // Auto-create first session
      createChatSession()
    }
  }, [user, sessions, isUserLoading, isSessionsLoading, router])

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh]">
      <Loader2 className="w-8 h-8 animate-spin text-(--accent) opacity-50 mb-4" />
      <span className="opacity-50">Відкриваємо чат...</span>
    </div>
  )
}

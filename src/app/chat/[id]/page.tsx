'use client'

import { useRouter } from 'next/navigation'
import ChatUI from '../ChatUI'
import { use } from 'react'
import { useUser, useChatMessages } from '@/hooks/useSupabase'
import { Loader2 } from 'lucide-react'

export default function ChatSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: history, isLoading: isHistoryLoading } = useChatMessages(id)

  if (isUserLoading || isHistoryLoading) {
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



  return <ChatUI initialMessages={history || []} sessionId={id} />
}

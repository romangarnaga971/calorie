import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatUI from '../ChatUI'

export default async function ChatSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify session belongs to user
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    redirect('/chat')
  }

  // Fetch messages for this session
  const { data: history } = await supabase
    .from('chat_messages')
    .select('id, role, content')
    .eq('session_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return <ChatUI initialMessages={history || []} sessionId={id} />
}

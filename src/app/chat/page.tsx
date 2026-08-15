import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createChatSession } from './actions'

export default async function ChatIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Find the latest chat session
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (sessions && sessions.length > 0) {
    // Redirect to the latest session
    redirect(`/chat/${sessions[0].id}`)
  } else {
    // If no sessions exist, automatically create one and redirect
    const { data: session } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: 'Новий чат' })
      .select('id')
      .single()
      
    if (session) {
      redirect(`/chat/${session.id}`)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <span className="opacity-50">Створення чату...</span>
    </div>
  )
}

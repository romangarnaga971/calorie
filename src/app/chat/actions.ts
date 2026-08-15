'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createChatSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check limit
  const { count } = await supabase
    .from('chat_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count !== null && count >= 5) {
    // Limit reached, do not create
    return { error: 'Maximum chat limit reached (5).' }
  }

  // Create new chat
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: user.id, title: 'Новий чат' })
    .select('id')
    .single()

  if (error || !session) {
    console.error('Failed to create chat:', error)
    return { error: 'Failed to create chat' }
  }

  revalidatePath('/chat')
  redirect(`/chat/${session.id}`)
}

export async function deleteChatSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete chat:', error)
  }

  revalidatePath('/chat')
  redirect('/chat')
}

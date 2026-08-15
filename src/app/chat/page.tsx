import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ChatUI from './ChatUI'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Load all history just for display
  const { data: history } = await supabase
    .from('chat_messages')
    .select('id, role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col flex-1 h-screen bg-(--background) animate-in">
      <header className="flex items-center gap-4 p-6 border-b border-(--border) bg-(--card) shrink-0 shadow-sm z-10 relative">
        <Link href="/diary" className="p-2 -ml-2 hover:bg-(--input) rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">AI Консультант</h1>
          <span className="text-xs text-green-500 font-medium">Онлайн</span>
        </div>
      </header>
      
      <ChatUI initialMessages={history || []} />
    </div>
  )
}

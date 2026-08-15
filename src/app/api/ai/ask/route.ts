import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

    // Check limit
    const { count } = await supabase
      .from('chat_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count !== null && count >= 5) {
       // If limit reached, delete the oldest one
       const { data: oldest } = await supabase
         .from('chat_sessions')
         .select('id')
         .eq('user_id', user.id)
         .order('updated_at', { ascending: true })
         .limit(1)
         .single()
         
       if (oldest) {
         await supabase.from('chat_sessions').delete().eq('id', oldest.id)
       }
    }

    // Create session
    const title = 'Аналіз їжі з етикетки'
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title })
      .select('id')
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
    }

    // We don't call the AI here to save time. We just inject the user message,
    // and let the client hit the AI when the chat loads, or we hit the AI here.
    // Let's hit the AI right now so the redirect shows the answer instantly.
    
    // We can call our own chat API internally by reusing its logic, 
    // but easier to just use fetch with full URL. Since we don't have full URL in route handlers easily,
    // we will just insert the user message, and a placeholder AI message?
    // No, let's just insert the user message. 
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      session_id: session.id,
      role: 'user',
      content: prompt
    })

    // To trigger the AI reply, we can redirect to chat page, and the chat page will see the last message is from user, but the chat page ChatUI ONLY fetches if user submits.
    // To make it automatic, let's just call the AI here. It takes 2-3 seconds.
    const baseUrl = req.headers.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    
    // Fire and wait for AI
    await fetch(`${protocol}://${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass cookies so the server-side fetch has auth
        'Cookie': req.headers.get('cookie') || ''
      },
      body: JSON.stringify({ message: prompt, sessionId: session.id })
    })

    return NextResponse.json({ sessionId: session.id })

  } catch (error: any) {
    console.error('Ask API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

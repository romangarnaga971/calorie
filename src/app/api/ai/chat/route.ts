import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { startOfDay, endOfDay, subDays } from 'date-fns'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Save user message to DB
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: message
    })

    // Fetch Context
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
    
    const todayStart = startOfDay(new Date()).toISOString()
    const todayEnd = endOfDay(new Date()).toISOString()
    const yesterdayStart = startOfDay(subDays(new Date(), 1)).toISOString()
    const yesterdayEnd = endOfDay(subDays(new Date(), 1)).toISOString()

    const { data: todayEntries } = await supabase
      .from('food_entries')
      .select('calories, protein_g, fat_g, carbs_g')
      .eq('user_id', user.id)
      .gte('logged_at', todayStart)
      .lte('logged_at', todayEnd)

    const { data: yesterdayEntries } = await supabase
      .from('food_entries')
      .select('calories, protein_g, fat_g, carbs_g')
      .eq('user_id', user.id)
      .gte('logged_at', yesterdayStart)
      .lte('logged_at', yesterdayEnd)

    const todaySums = todayEntries?.reduce((acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein_g,
      fat: acc.fat + curr.fat_g,
      carbs: acc.carbs + curr.carbs_g
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 }) || { calories: 0, protein: 0, fat: 0, carbs: 0 }

    const yesterdaySums = yesterdayEntries?.reduce((acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein_g,
      fat: acc.fat + curr.fat_g,
      carbs: acc.carbs + curr.carbs_g
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 }) || { calories: 0, protein: 0, fat: 0, carbs: 0 }

    // Fetch last 4 messages for UI context
    const { data: recentHistory } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5) // Includes the message we just saved
      
    // Reverse to chronological
    const history = recentHistory ? recentHistory.reverse() : []

    const systemPrompt = `
      You are an AI nutritionist and fitness coach.
      User Profile:
      - Goal: ${profile?.goal}
      - Daily Norm: ${profile?.daily_calories} kcal (Protein: ${profile?.daily_protein_g}g, Fat: ${profile?.daily_fat_g}g, Carbs: ${profile?.daily_carbs_g}g)
      - Restrictions: ${profile?.restrictions_text || 'None'}
      
      Eaten Today:
      - Calories: ${todaySums.calories} kcal
      - Protein: ${todaySums.protein}g, Fat: ${todaySums.fat}g, Carbs: ${todaySums.carbs}g
      
      Eaten Yesterday:
      - Calories: ${yesterdaySums.calories} kcal
      
      Be friendly, empathetic, concise, and helpful. Answer in Ukrainian.
    `

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      systemInstruction: systemPrompt
    })

    const aiMessage = response.text

    // Save AI message to DB
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: aiMessage
    })

    return NextResponse.json({ message: aiMessage })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

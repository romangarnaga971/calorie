import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { subDays, startOfDay } from 'date-fns'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
    if (!profile) throw new Error('Profile not found')

    // Fetch Weight Logs (last 14 days)
    const twoWeeksAgo = startOfDay(subDays(new Date(), 14)).toISOString()
    const { data: weights } = await supabase
      .from('weight_logs')
      .select('weight_kg, date')
      .eq('user_id', user.id)
      .gte('date', twoWeeksAgo)
      .order('date', { ascending: true })

    // Fetch Food Logs (last 14 days)
    const { data: foods } = await supabase
      .from('food_entries')
      .select('calories, protein_g, logged_at')
      .eq('user_id', user.id)
      .gte('logged_at', twoWeeksAgo)

    const prompt = `
      You are an expert AI nutritionist. Analyze the user's progress and decide if their daily calorie norm should be adjusted.
      
      User Goal: ${profile.goal}
      Desired Pace: ${profile.goal_pace}
      Current Norm: ${profile.daily_calories} kcal, ${profile.daily_protein_g}g Protein
      
      Weight Logs (Last 14 days):
      ${JSON.stringify(weights || [])}
      
      Food Entries (Last 14 days):
      ${JSON.stringify(foods || [])}
      
      Determine if the user's weight is trending in the right direction according to their goal.
      If progress has stalled for a week, suggest an adjustment.
      For weight loss stall: Suggest -100 to -200 kcal.
      For weight gain stall: Suggest +100 to +200 kcal.
      If progress is good, suggest 0 change.
      
      Return ONLY a valid JSON object:
      {
        "reasoning": "Short explanation in Ukrainian",
        "recommended_calorie_change": number (e.g., -100, 0, or 100),
        "recommended_protein_change": number (usually 0, unless they eat too little)
      }
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' }
    })

    const parsed = JSON.parse(response.text || '{}')

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Adaptation API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

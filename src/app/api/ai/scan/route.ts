import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageBase64, mimeType, mode } = await req.json()

    if (!imageBase64 || !mimeType || !mode) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    let prompt = ''
    if (mode === 'dish') {
      prompt = `
        You are a highly accurate nutrition AI. Analyze the image of the food. 
        Estimate its weight in grams and nutritional values for the entire portion shown.
        Return ONLY a valid JSON object with the following fields and types:
        {
          "name": string (Dish name in Ukrainian),
          "weight_g": number (estimated total weight),
          "calories": number (total kcal),
          "protein_g": number,
          "fat_g": number,
          "carbs_g": number,
          "confidence": number (from 0.0 to 1.0 indicating your confidence in this estimation)
        }
      `
    } else if (mode === 'label') {
      prompt = `
        You are a highly accurate nutrition AI. Analyze the image of the nutritional label.
        Extract the exact nutritional values PER 100g or 100ml.
        Return ONLY a valid JSON object with the following fields and types:
        {
          "name": string (Guess the product name in Ukrainian, or return "Продукт"),
          "weight_g": 100,
          "calories": number (kcal per 100g),
          "protein_g": number (per 100g),
          "fat_g": number (per 100g),
          "carbs_g": number (per 100g),
          "confidence": number (from 0.0 to 1.0 indicating text legibility)
        }
      `
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    })

    const responseText = response.text || ''
    
    try {
      const parsed = JSON.parse(responseText)
      return NextResponse.json(parsed)
    } catch (e) {
      console.error("Failed to parse Gemini response:", responseText)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

  } catch (error: any) {
    console.error('AI Scan API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

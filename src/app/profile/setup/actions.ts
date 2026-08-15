'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const age = parseInt(formData.get('age') as string)
  const weight = parseFloat(formData.get('weight') as string)
  const height = parseInt(formData.get('height') as string)
  const sex = formData.get('sex') as 'male' | 'female'
  const activityLevel = formData.get('activity_level') as string
  const goal = formData.get('goal') as string
  const goalPace = formData.get('goal_pace') as string
  const name = formData.get('name') as string
  const restrictions = formData.get('restrictions') as string

  // 1. Calculate BMR
  let bmr = 10 * weight + 6.25 * height - 5 * age
  if (sex === 'male') {
    bmr += 5
  } else {
    bmr -= 161
  }

  // 2. Activity Multiplier
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'high': 1.725
  }
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2)

  // 3. Goal Adjustment
  let dailyCalories = tdee
  const paces: Record<string, number> = {
    'slow': 250,
    'standard': 500,
    'fast': 750
  }
  const diff = paces[goalPace] || 500

  if (goal === 'lose') {
    dailyCalories -= diff
  } else if (goal === 'gain') {
    dailyCalories += diff
  }

  // Ensure minimum safe calories
  const minCals = sex === 'male' ? 1500 : 1200
  if (dailyCalories < minCals) {
    dailyCalories = minCals
  }

  dailyCalories = Math.round(dailyCalories)

  // 4. Calculate Macros
  // Protein: 1.6 to 2.2g per kg, using 2g for simplicity
  const dailyProtein = Math.round(weight * 2.0)
  
  // Fat: 1g per kg
  const dailyFat = Math.round(weight * 1.0)
  
  // Carbs: rest of calories
  const proteinCals = dailyProtein * 4
  const fatCals = dailyFat * 9
  const remainingCals = dailyCalories - proteinCals - fatCals
  
  const dailyCarbs = Math.max(0, Math.round(remainingCals / 4))

  // Save to DB
  const profileData = {
    user_id: user.id,
    name,
    age,
    sex,
    weight_kg: weight,
    height_cm: height,
    activity_level: activityLevel,
    goal,
    goal_pace: goalPace,
    restrictions_text: restrictions,
    daily_calories: dailyCalories,
    daily_protein_g: dailyProtein,
    daily_fat_g: dailyFat,
    daily_carbs_g: dailyCarbs
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'user_id' })

  if (error) {
    console.error(error)
    return { error: 'Failed to save profile' }
  }

  revalidatePath('/profile')
  revalidatePath('/', 'layout')
  redirect('/diary') // Proceed to main screen
}

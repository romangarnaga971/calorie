'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { startOfDay } from 'date-fns'

export async function logWeight(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const weight = parseFloat(formData.get('weight') as string)
  const today = startOfDay(new Date()).toISOString()

  const { error } = await supabase
    .from('weight_logs')
    .upsert(
      { user_id: user.id, date: today, weight_kg: weight },
      { onConflict: 'user_id, date' }
    )

  if (error) {
    console.error(error)
    return { error: 'Failed to log weight' }
  }

  // Also update current weight in profile
  await supabase
    .from('profiles')
    .update({ weight_kg: weight })
    .eq('user_id', user.id)

  revalidatePath('/progress')
  revalidatePath('/diary')
}

export async function updateNorms(caloriesChange: number, proteinChange: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_calories, daily_protein_g')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const newCals = profile.daily_calories + caloriesChange
  const newProtein = profile.daily_protein_g + proteinChange

  const { error } = await supabase
    .from('profiles')
    .update({ 
      daily_calories: newCals,
      daily_protein_g: newProtein
    })
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return { error: 'Failed to update norms' }
  }

  // Record this suggestion as accepted
  await supabase.from('norm_adjustment_suggestions').insert({
    user_id: user.id,
    suggested_calorie_change: caloriesChange,
    reasoning: 'Accepted via AI recommendation',
    is_accepted: true
  })

  revalidatePath('/progress')
  revalidatePath('/diary')
}

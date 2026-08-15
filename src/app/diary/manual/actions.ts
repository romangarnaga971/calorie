'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function addManualEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
  const calories = parseInt(formData.get('calories') as string)
  const protein = parseFloat(formData.get('protein') as string)
  const fat = parseFloat(formData.get('fat') as string)
  const carbs = parseFloat(formData.get('carbs') as string)

  const { error } = await supabase
    .from('food_entries')
    .insert({
      user_id: user.id,
      source_type: 'manual',
      name,
      weight_g: weight,
      calories,
      protein_g: protein,
      fat_g: fat,
      carbs_g: carbs
    })

  if (error) {
    console.error(error)
    return { error: 'Failed to add entry' }
  }

  revalidatePath('/diary')
  redirect('/diary')
}

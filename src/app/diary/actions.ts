'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteFoodEntry(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('food_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return { error: 'Failed to delete' }
  }

  revalidatePath('/diary')
}

export async function addWaterEntry(amount_ml: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('water_logs')
    .insert({
      user_id: user.id,
      amount_ml
    })

  if (error) {
    console.error(error)
    return { error: 'Failed to add water' }
  }

  revalidatePath('/diary')
}

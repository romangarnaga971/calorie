import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import ProgressClient from './ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
  
  if (!profile) {
    redirect('/profile/setup')
  }

  const { data: weightLogs } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(14)

  return (
    <div className="flex flex-col flex-1 p-6 pb-24 animate-in">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/diary" className="p-2 -ml-2 hover:bg-(--input) rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Мій прогрес</h1>
      </header>

      <div className="bg-(--input) p-5 rounded-2xl mb-8 flex justify-between items-center">
        <div>
          <span className="text-sm opacity-60 block">Поточна вага</span>
          <span className="text-3xl font-bold text-(--foreground)">{profile.weight_kg} <span className="text-lg font-normal opacity-60">кг</span></span>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-(--accent)/10 text-(--accent)">
          {profile.goal === 'lose' ? <TrendingDown /> : profile.goal === 'gain' ? <TrendingUp /> : <Minus />}
        </div>
      </div>

      <ProgressClient 
        currentCalories={profile.daily_calories} 
        currentProtein={profile.daily_protein_g}
        weightLogs={weightLogs || []} 
      />
    </div>
  )
}

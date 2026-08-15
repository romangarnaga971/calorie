'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Loader2 } from 'lucide-react'
import ProgressClient from './ProgressClient'
import { useProfile, useUser, useWeightLogs } from '@/hooks/useSupabase'

export default function ProgressPage() {
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: weightLogs, isLoading: isWeightLoading } = useWeightLogs()

  if (isUserLoading || isProfileLoading || isWeightLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[100dvh]">
        <Loader2 className="w-8 h-8 animate-spin text-(--accent) opacity-50" />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  if (!profile) {
    router.replace('/profile/setup')
    return null
  }



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

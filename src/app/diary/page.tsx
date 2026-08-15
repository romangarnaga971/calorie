'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProgressRing } from '@/components/ProgressRing'
import { MacroBar } from '@/components/MacroBar'
import { Plus, Camera, ScanBarcode, Settings, MessageCircle, LineChart, Loader2 } from 'lucide-react'
import { deleteFoodEntry } from './actions'
import { useProfile, useTodayEntries } from '@/hooks/useSupabase'

export default function DiaryPage() {
  const router = useRouter()
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: entries, isLoading: isEntriesLoading, mutate } = useTodayEntries()

  if (isProfileLoading || isEntriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[100dvh]">
        <Loader2 className="w-8 h-8 animate-spin text-(--accent) opacity-50" />
      </div>
    )
  }

  if (!profile) {
    router.replace('/profile/setup')
    return null
  }



  const consumedCalories = entries?.reduce((sum, e) => sum + e.calories, 0) || 0
  const consumedProtein = entries?.reduce((sum, e) => sum + e.protein_g, 0) || 0
  const consumedFat = entries?.reduce((sum, e) => sum + e.fat_g, 0) || 0
  const consumedCarbs = entries?.reduce((sum, e) => sum + e.carbs_g, 0) || 0

  const calProgress = profile.daily_calories > 0 ? consumedCalories / profile.daily_calories : 0

  return (
    <div className="flex flex-col flex-1 p-6 pb-24 animate-in">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Щоденник</h1>
        <div className="flex gap-2">
          <Link href="/progress" className="p-2 bg-(--input) rounded-full hover:opacity-80 flex items-center justify-center text-(--foreground)">
            <LineChart className="w-5 h-5" />
          </Link>
          <Link href="/chat" className="p-2 bg-(--input) rounded-full hover:opacity-80 flex items-center justify-center text-(--accent)">
            <MessageCircle className="w-5 h-5" />
          </Link>
          <Link href="/settings" className="p-2 bg-(--input) rounded-full hover:opacity-80 flex items-center justify-center text-(--foreground)">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Calories Ring */}
      <div className="flex justify-center mb-8">
        <ProgressRing 
          progress={calProgress} 
          label="ккал" 
          value={consumedCalories} 
          total={profile.daily_calories} 
        />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <MacroBar label="Білки" value={consumedProtein} total={profile.daily_protein_g} colorClass="--color-protein" />
        <MacroBar label="Жири" value={consumedFat} total={profile.daily_fat_g} colorClass="--color-fat" />
        <MacroBar label="Вуглеводи" value={consumedCarbs} total={profile.daily_carbs_g} colorClass="--color-carbs" />
      </div>

      {/* Entries List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Сьогодні</h2>
      </div>

      <div className="flex flex-col gap-3">
        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="flex justify-between items-center p-4 bg-(--input) rounded-2xl">
              <div className="flex flex-col">
                <span className="font-medium">{entry.name}</span>
                <span className="text-sm opacity-60">
                  {entry.weight_g ? `${entry.weight_g}г • ` : ''}
                  Б:{entry.protein_g} Ж:{entry.fat_g} В:{entry.carbs_g}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">{entry.calories} <span className="text-xs opacity-60 font-normal">ккал</span></span>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    // Optimistic update
                    const newEntries = entries.filter(item => item.id !== entry.id);
                    mutate(newEntries, false);
                    await deleteFoodEntry(entry.id);
                    mutate();
                  }}
                  className="text-red-400 opacity-60 hover:opacity-100 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-(--border) rounded-2xl opacity-60">
            Поки нічого не додано.
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 bg-(--card) p-3 rounded-full shadow-lg border border-(--border)">
        <Link href="/diary/manual" className="flex flex-col items-center justify-center w-14 h-14 bg-(--input) text-(--foreground) rounded-full hover:bg-(--border) transition-colors">
          <Plus className="w-6 h-6" />
        </Link>
        <Link href="/diary/scan" className="flex items-center justify-center w-16 h-16 bg-(--accent) text-(--accent-foreground) rounded-full shadow-md hover:opacity-90 transition-opacity">
          <Camera className="w-7 h-7" />
        </Link>
        <Link href="/diary/scan?mode=label" className="flex items-center justify-center w-14 h-14 bg-(--input) text-(--foreground) rounded-full hover:bg-(--border) transition-colors">
          <ScanBarcode className="w-6 h-6" />
        </Link>
      </div>
    </div>
  )
}

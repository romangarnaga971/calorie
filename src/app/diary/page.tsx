'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProgressRing } from '@/components/ProgressRing'
import { MacroBar } from '@/components/MacroBar'
import { Plus, Camera, ScanBarcode, Settings, MessageCircle, LineChart, Loader2, Repeat, ChevronDown } from 'lucide-react'
import { deleteFoodEntry, deleteWaterEntry, addWaterEntry } from './actions'
import { useProfile, useTodayEntries, useTodayWater } from '@/hooks/useSupabase'
import { WaterTrackerButton } from '@/components/WaterTrackerButton'
import { useState } from 'react'

export default function DiaryPage() {
  const router = useRouter()
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: entries, isLoading: isEntriesLoading, mutate } = useTodayEntries()
  const { data: waterLogs, isLoading: isWaterLoading, mutate: mutateWater } = useTodayWater()
  
  const [isWaterMode, setIsWaterMode] = useState(false)

  if (isProfileLoading || isEntriesLoading || isWaterLoading) {
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

  const consumedWater = waterLogs?.reduce((sum, e) => sum + e.amount_ml, 0) || 0
  const waterGoal = profile.daily_water_ml || 2000
  const waterProgress = waterGoal > 0 ? consumedWater / waterGoal : 0

  const handleAddWater = async (amount: number) => {
    // Optimistic update
    const newLog = { id: Math.random().toString(), user_id: profile.id, amount_ml: amount, logged_at: new Date().toISOString() }
    mutateWater([newLog, ...(waterLogs || [])], false)
    await addWaterEntry(amount)
    mutateWater()
  }

  return (
    <div className="flex flex-col flex-1 pb-24 animate-in overflow-hidden">
      <header className="flex items-center justify-between p-6 pb-2">
        <h1 className="text-2xl font-bold">Yabka</h1>
        <div className="flex items-center gap-3">
          <Link href="/settings" className="p-2 bg-(--input) rounded-full hover:opacity-80 flex items-center justify-center text-(--foreground)">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* 3D Flip Container */}
      <div 
        className="relative flex justify-center mb-8 mx-auto w-64 h-64"
        style={{ perspective: '1000px' }}
      >
        {/* The rotate hint icon */}
        <div className="absolute top-0 right-0 p-2 bg-(--input) text-(--foreground) opacity-60 rounded-full z-10 pointer-events-none transition-opacity duration-300">
          <Repeat className="w-5 h-5" />
        </div>

        <div 
          className="w-full h-full relative transition-transform duration-700 cursor-pointer"
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: isWaterMode ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
          onClick={() => setIsWaterMode(!isWaterMode)}
        >
          {/* Front (Calories) */}
          <div 
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <ProgressRing 
              progress={calProgress} 
              label="ккал" 
              value={consumedCalories} 
              total={profile.daily_calories} 
            />
          </div>
          
          {/* Back (Water) */}
          <div 
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)' 
            }}
          >
            <ProgressRing 
              progress={waterProgress} 
              label="мл" 
              value={consumedWater} 
              total={waterGoal}
              color="#3b82f6"
            />
          </div>
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col relative">
        {/* We use position absolute to crossfade or we just conditionally render */}
        {isWaterMode ? (
          <div className="flex-1 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300 w-full">
            <WaterTrackerButton onAdd={handleAddWater} />
            
            {/* Scroll down hint */}
            {waterLogs && waterLogs.length > 0 && (
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity animate-bounce mt-4 mb-4 text-sm font-medium"
              >
                <span>Історія випитої води ({waterLogs.length})</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            )}
            
            {/* Water History */}
            <div className="w-full mt-4 flex flex-col gap-2 pb-8">
              {waterLogs && waterLogs.length > 0 ? (
                waterLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 bg-(--card) shadow-sm border border-(--border)/50 rounded-xl w-full">
                    <span className="font-medium text-blue-500">{log.amount_ml} мл</span>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        const newLogs = waterLogs.filter(item => item.id !== log.id);
                        mutateWater(newLogs, false);
                        await deleteWaterEntry(log.id);
                        mutateWater();
                      }}
                      className="text-red-400 opacity-60 hover:opacity-100 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-sm opacity-50">Немає записів</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300">
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
            <div key={entry.id} className="flex justify-between items-center p-4 bg-(--card) shadow-sm border border-(--border) rounded-2xl">
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
    </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between bg-(--card) p-3 px-4 rounded-full shadow-lg border border-(--border) w-[92%] max-w-[380px]">
        <Link href="/progress" className="flex items-center justify-center w-12 h-12 text-(--foreground) hover:opacity-80 transition-opacity">
          <LineChart className="w-6 h-6" />
        </Link>
        <Link href="/diary/manual" className="flex items-center justify-center w-12 h-12 bg-(--input) text-(--foreground) rounded-full hover:bg-(--border) transition-colors">
          <Plus className="w-5 h-5" />
        </Link>
        <Link href="/diary/scan" className="flex items-center justify-center w-16 h-16 bg-(--accent) text-(--accent-foreground) rounded-full shadow-md hover:opacity-90 transition-opacity shrink-0">
          <Camera className="w-7 h-7" />
        </Link>
        <Link href="/diary/scan?mode=label" className="flex items-center justify-center w-12 h-12 bg-(--input) text-(--foreground) rounded-full hover:bg-(--border) transition-colors">
          <ScanBarcode className="w-5 h-5" />
        </Link>
        <Link href="/chat" className="flex items-center justify-center w-12 h-12 text-(--accent) hover:opacity-80 transition-opacity">
          <MessageCircle className="w-6 h-6" />
        </Link>
      </div>
    </div>
  )
}

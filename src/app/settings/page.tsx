'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Loader2 } from 'lucide-react'
import { signOut } from './actions'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PushToggle } from '@/components/PushToggle'
import { SignOutButton } from './SignOutButton'
import { useProfile, useUser } from '@/hooks/useSupabase'

export default function SettingsPage() {
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: profile, isLoading: isProfileLoading } = useProfile()

  if (isUserLoading || isProfileLoading) {
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

  const goalLabels: Record<string, string> = {
    lose: 'Схуднення',
    maintain: 'Підтримка ваги',
    gain: 'Набір маси'
  }

  const paceLabels: Record<string, string> = {
    slow: 'Повільно (0.25 кг/тиждень)',
    medium: 'Середньо (0.5 кг/тиждень)',
    fast: 'Швидко (1 кг/тиждень)'
  }

  return (
    <div className="flex flex-col flex-1 px-6 pb-12 animate-in relative">
      <header className="sticky top-0 z-10 flex items-center gap-4 mb-6 py-4 bg-(--background)/80 backdrop-blur-lg -mx-6 px-6 border-b border-(--border)/50">
        <Link href="/diary" className="p-2 -ml-2 bg-(--input) hover:bg-(--border) rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Налаштування</h1>
      </header>

      <section className="bg-(--card) border border-(--border) rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-(--border)">
          <div className="w-16 h-16 bg-(--accent)/10 text-(--accent) rounded-full flex items-center justify-center shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-semibold text-lg truncate">{user.email}</h2>
            <p className="text-sm opacity-60">ID: {user.id.slice(0, 8)}...</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="opacity-70">Вік</span>
            <span className="font-medium">{profile.age} років</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Зріст</span>
            <span className="font-medium">{profile.height_cm} см</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Поточна вага</span>
            <span className="font-medium">{profile.weight_kg} кг</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Стать</span>
            <span className="font-medium">{profile.sex === 'male' ? 'Чоловіча' : 'Жіноча'}</span>
          </div>
        </div>
      </section>

      <section className="bg-(--card) border border-(--border) rounded-2xl p-5 mb-8">
        <h3 className="font-semibold mb-4 text-(--accent)">Ваша мета</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="opacity-70 text-sm">Тип</span>
            <span className="font-medium">{goalLabels[profile.goal]}</span>
          </div>
          {profile.goal !== 'maintain' && (
            <div className="flex flex-col gap-1">
              <span className="opacity-70 text-sm">Темп</span>
              <span className="font-medium">{paceLabels[profile.goal_pace] || 'Середній'}</span>
            </div>
          )}
          <div className="flex flex-col gap-1 pt-2 border-t border-(--border)">
            <span className="opacity-70 text-sm">Денна норма калорій</span>
            <span className="font-bold text-lg">{profile.daily_calories} ккал</span>
          </div>
        </div>
      </section>

      <section className="bg-(--card) border border-(--border) rounded-2xl p-5 mb-8">
        <h3 className="font-semibold mb-4 text-(--accent)">Вигляд</h3>
        <ThemeToggle />
      </section>

      <section className="bg-(--card) border border-(--border) rounded-2xl p-5 mb-8">
        <PushToggle />
      </section>

      <div className="mt-auto pt-4">
        <form action={signOut}>
          <SignOutButton />
        </form>
      </div>
    </div>
  )
}

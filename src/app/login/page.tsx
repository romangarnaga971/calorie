'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const isSignupMode = searchParams.get('mode') === 'signup'
  const [isLogin, setIsLogin] = useState(!isSignupMode)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    // Server action will handle redirect or error throwing which reloads the page with ?error=...
    // We just show a loader here.
  }

  return (
    <div className="flex flex-col flex-1 p-6 animate-in justify-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isLogin ? 'З поверненням' : 'Створити акаунт'}
        </h1>
        <p className="text-(--foreground) opacity-70">
          {isLogin 
            ? 'Увійдіть, щоб продовжити відстежувати свої калорії' 
            : 'Зареєструйтесь, щоб почати свій шлях до кращого здоров\'я'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        action={isLogin ? login : signup} 
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--foreground) opacity-80 pl-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full bg-(--input) border-none rounded-xl px-4 py-3.5 text-(--foreground) placeholder:text-(--foreground)/40 focus:ring-2 focus:ring-(--accent) focus:outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--foreground) opacity-80 pl-1" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-(--input) border-none rounded-xl px-4 py-3.5 text-(--foreground) placeholder:text-(--foreground)/40 focus:ring-2 focus:ring-(--accent) focus:outline-none transition-all"
          />
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-(--accent) text-(--accent-foreground) py-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity mt-4 flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            isLogin ? 'Увійти' : 'Зареєструватися'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-(--foreground) opacity-70 hover:opacity-100 transition-opacity"
        >
          {isLogin 
            ? 'Немає акаунту? Створити новий' 
            : 'Вже маєте акаунт? Увійти'
          }
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-50" /></div>}>
      <LoginContent />
    </Suspense>
  )
}

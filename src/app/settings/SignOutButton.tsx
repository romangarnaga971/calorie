'use client'

import { useFormStatus } from 'react-dom'
import { LogOut, Loader2 } from 'lucide-react'

export function SignOutButton() {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-xl font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <LogOut className="w-5 h-5" />
      )}
      {pending ? 'Виходимо...' : 'Вийти з акаунту'}
    </button>
  )
}

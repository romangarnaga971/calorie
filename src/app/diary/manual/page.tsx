'use client'

import { useState } from 'react'
import { addManualEntry } from './actions'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ManualEntryPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
  }

  return (
    <div className="flex flex-col p-6 animate-in">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/diary" className="p-2 -ml-2 hover:bg-(--input) rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Додати вручну</h1>
      </header>

      <form 
        onSubmit={handleSubmit}
        action={addManualEntry} 
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium opacity-80 pl-1">Що ви з'їли?</label>
          <input name="name" type="text" required placeholder="Напр. Вівсянка з яблуком" className="w-full bg-(--input) border-none rounded-xl px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-(--accent) focus:outline-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium opacity-80 pl-1">Вага порції (грами, опційно)</label>
          <input name="weight" type="number" placeholder="250" className="w-full bg-(--input) border-none rounded-xl px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-(--accent) focus:outline-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium opacity-80 pl-1">Калорії (ккал)</label>
          <input name="calories" type="number" required placeholder="350" className="w-full bg-(--input) border-none rounded-xl px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-(--accent) focus:outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Білки</label>
            <input name="protein" type="number" step="0.1" required placeholder="10" className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Жири</label>
            <input name="fat" type="number" step="0.1" required placeholder="5" className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Вуглеводи</label>
            <input name="carbs" type="number" step="0.1" required placeholder="45" className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none" />
          </div>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-(--accent) text-(--accent-foreground) py-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity mt-4 flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Зберегти запис'
          )}
        </button>
      </form>
    </div>
  )
}

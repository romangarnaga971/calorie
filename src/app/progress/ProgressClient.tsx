'use client'

import { useState } from 'react'
import { logWeight, updateNorms } from './actions'
import { Loader2, Sparkles, Check } from 'lucide-react'

type Recommendation = {
  reasoning: string
  recommended_calorie_change: number
  recommended_protein_change: number
} | null

export default function ProgressClient({ currentCalories, currentProtein, weightLogs }: { currentCalories: number, currentProtein: number, weightLogs: any[] }) {
  const [isLogging, setIsLogging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleLogWeight = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLogging(true)
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/ai/adapt', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRecommendation(data)
    } catch (err) {
      console.error(err)
      alert("Помилка аналізу.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApply = async () => {
    if (!recommendation) return
    setIsApplying(true)
    await updateNorms(recommendation.recommended_calorie_change, recommendation.recommended_protein_change)
    setRecommendation(null)
    setIsApplying(false)
    alert("Норму успішно оновлено!")
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Weight Logging Form */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Логування ваги</h2>
        <form onSubmit={handleLogWeight} action={logWeight} className="flex gap-3">
          <input 
            type="number" 
            name="weight" 
            step="any" 
            required 
            placeholder="Ваша вага сьогодні (кг)"
            className="flex-1 bg-(--input) border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none"
          />
          <button 
            disabled={isLogging}
            type="submit" 
            className="bg-(--accent) text-(--accent-foreground) px-6 rounded-xl font-medium shadow-sm hover:opacity-90 disabled:opacity-70"
          >
            {isLogging ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Зберегти'}
          </button>
        </form>
      </section>

      {/* Weight History */}
      {weightLogs && weightLogs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Історія зважувань</h2>
          <div className="bg-(--card) border border-(--border) rounded-2xl overflow-hidden">
            {weightLogs.map((log: any, idx: number) => (
              <div key={log.id} className={`flex justify-between items-center p-4 ${idx !== weightLogs.length - 1 ? 'border-b border-(--border)' : ''}`}>
                <span className="opacity-70">{new Date(log.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}</span>
                <span className="font-medium">{log.weight_kg} кг</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Analysis */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Адаптація норми</h2>
        </div>
        
        <p className="text-sm opacity-70 mb-4">
          AI може проаналізувати ваш прогрес за останні 14 днів і підказати, чи потрібно змінити денну норму калорій.
        </p>

        {!recommendation ? (
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 bg-(--card) border border-(--border) text-(--foreground) py-4 rounded-xl font-medium shadow-sm hover:bg-(--input) transition-colors disabled:opacity-70"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Аналізую...</>
            ) : (
              <><Sparkles className="w-5 h-5 text-(--accent)" /> Аналізувати прогрес</>
            )}
          </button>
        ) : (
          <div className="bg-(--input) rounded-2xl p-5 border border-(--accent)/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-(--accent)" /> Висновок AI
            </h3>
            <p className="text-sm opacity-80 mb-4">{recommendation.reasoning}</p>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-(--card) p-3 rounded-xl border border-(--border) text-center">
                <span className="block text-xs opacity-60 mb-1">Нова норма</span>
                <span className="font-bold text-lg">{currentCalories + recommendation.recommended_calorie_change} <span className="text-sm font-normal opacity-60">ккал</span></span>
                {recommendation.recommended_calorie_change !== 0 && (
                  <span className={`block text-xs font-medium mt-1 ${recommendation.recommended_calorie_change > 0 ? 'text-green-500' : 'text-orange-500'}`}>
                    {recommendation.recommended_calorie_change > 0 ? '+' : ''}{recommendation.recommended_calorie_change} ккал
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={handleApply}
              disabled={isApplying || recommendation.recommended_calorie_change === 0}
              className="w-full flex items-center justify-center gap-2 bg-(--accent) text-(--accent-foreground) py-3.5 rounded-xl font-medium shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Застосувати зміну</>}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

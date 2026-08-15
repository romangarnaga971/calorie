'use client'

import { useState } from 'react'
import { saveProfile } from './actions'
import { Loader2 } from 'lucide-react'

export default function ProfileSetupPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
  }

  return (
    <div className="flex flex-col p-6 animate-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ваш профіль</h1>
        <p className="text-(--foreground) opacity-70 text-sm">
          Заповніть ці дані один раз, щоб ми могли розрахувати вашу індивідуальну норму калорій.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        action={saveProfile} 
        className="flex flex-col gap-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-(--border) pb-2">Базова інформація</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Ім'я</label>
            <input name="name" type="text" required placeholder="Як до вас звертатися?" className="w-full bg-(--input) border-none rounded-xl px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-(--accent) focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Вік (років)</label>
              <input name="age" type="number" min="10" max="100" required placeholder="25" className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Стать</label>
              <select name="sex" required className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none appearance-none">
                <option value="male">Чоловіча</option>
                <option value="female">Жіноча</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Вага (кг)</label>
              <input name="weight" type="number" step="any" min="30" max="300" required placeholder="70" className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Зріст (см)</label>
              <input name="height" type="number" min="100" max="250" required placeholder="175" className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-(--border) pb-2">Стиль життя та мета</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Рівень активності</label>
            <select name="activity_level" required className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none appearance-none">
              <option value="sedentary">Сидячий (мало або без тренувань)</option>
              <option value="light">Легка (тренування 1-3 рази на тиждень)</option>
              <option value="moderate">Помірна (тренування 3-5 разів на тиждень)</option>
              <option value="high">Висока (тренування 6-7 разів на тиждень)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Ваша ціль</label>
            <select name="goal" required className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none appearance-none">
              <option value="lose">Схуднення</option>
              <option value="maintain">Підтримка ваги</option>
              <option value="gain">Набір маси</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Темп</label>
            <select name="goal_pace" required className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none appearance-none">
              <option value="slow">Повільно / Комфортно (±0.25 кг/тиж)</option>
              <option value="standard">Стандартно (±0.5 кг/тиж)</option>
              <option value="fast">Швидко (±0.75 кг/тиж)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Харчові обмеження / Алергії</label>
            <textarea name="restrictions" rows={2} placeholder="Без глютену, лактози, вегетаріанець..." className="w-full bg-(--input) rounded-xl px-4 py-3 focus:ring-2 focus:ring-(--accent) focus:outline-none resize-none" />
          </div>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-(--accent) text-(--accent-foreground) py-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity mt-4 mb-10 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Зберегти профіль'
          )}
        </button>
      </form>
    </div>
  )
}

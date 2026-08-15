'use client'

import { useState, useRef } from 'react'
import { saveScannedEntry } from './actions'
import { Loader2, ArrowLeft, Camera, Upload, Check, MessageSquare } from 'lucide-react'
import { AppleLoader } from '@/components/AppleLoader'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type ScanResult = {
  name: string
  weight_g: number
  calories: number
  protein_g: number
  fat_g: number
  carbs_g: number
  confidence: number
}

function ScanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'label' ? 'label' : 'dish'

  const [mode, setMode] = useState<'dish' | 'label'>(initialMode)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // For label mode: user specified portion size
  const [portion, setPortion] = useState<number>(100)

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setError(null)
    setResult(null)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1]
        
        // Call API
        const res = await fetch('/api/ai/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            mimeType: file.type,
            mode
          })
        })

        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || 'Failed to scan')
        
        setResult(data)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsScanning(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSaving(true)
  }

  const multiplier = mode === 'label' ? portion / 100 : 1

  const handleAskAI = async () => {
    if (!result) return
    setIsSaving(true) // Reuse loading state
    
    try {
      const prompt = `Привіт! Я хочу з'їсти ось це: ${result.name}. Порція: ${mode === 'label' ? portion : result.weight_g}г. ` +
                     `Там ${Math.round(result.calories * multiplier)} ккал, ${Math.round(result.protein_g * multiplier)}г білка, ` + 
                     `${Math.round(result.fat_g * multiplier)}г жирів і ${Math.round(result.carbs_g * multiplier)}г вуглеводів. ` +
                     `Скажи коротко, чи норм це їсти?`
                     
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (data.sessionId) {
        router.push(`/chat/${data.sessionId}`)
      }
    } catch (err) {
      console.error(err)
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col p-6 animate-in">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/diary" className="p-2 -ml-2 hover:bg-(--input) rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Сканер {mode === 'dish' ? 'страви' : 'етикетки'}</h1>
      </header>

      {/* Mode Selector */}
      {!result && !isScanning && (
        <div className="flex p-1 bg-(--input) rounded-xl mb-8">
          <button 
            onClick={() => setMode('dish')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${mode === 'dish' ? 'bg-(--card) shadow-sm text-(--foreground)' : 'text-(--foreground) opacity-60'}`}
          >
            Готова страва
          </button>
          <button 
            onClick={() => setMode('label')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${mode === 'label' ? 'bg-(--card) shadow-sm text-(--foreground)' : 'text-(--foreground) opacity-60'}`}
          >
            Етикетка (КБЖУ)
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {isScanning ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[300px] gap-8">
          <AppleLoader />
          <p className="text-(--foreground) opacity-70 animate-pulse text-center font-medium">
            Штучний інтелект аналізує фото...<br />Це займе кілька секунд.
          </p>
        </div>
      ) : !result ? (
        <div className="flex flex-col gap-4">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageCapture}
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 bg-(--accent) text-(--accent-foreground) py-12 rounded-2xl shadow-sm hover:opacity-90 transition-opacity"
          >
            <Camera className="w-12 h-12" />
            <span className="font-semibold text-lg">Зробити фото</span>
          </button>
          
          <button 
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture')
                fileInputRef.current.click()
              }
            }}
            className="flex flex-col items-center justify-center gap-2 bg-(--input) text-(--foreground) py-6 rounded-2xl hover:opacity-90 transition-opacity"
          >
            <Upload className="w-6 h-6 opacity-70" />
            <span className="font-medium opacity-80">Завантажити з галереї</span>
          </button>

          <p className="text-sm opacity-60 text-center mt-4">
            {mode === 'dish' 
              ? 'Сфотографуйте страву повністю, щоб AI міг оцінити розмір порції.'
              : 'Сфотографуйте таблицю харчової цінності на 100г.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSave} action={saveScannedEntry} className="flex flex-col gap-5">
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="confidence" value={result.confidence} />

          <div className="bg-(--accent)/10 text-(--accent) p-4 rounded-xl flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-1">Успішно розпізнано! (Впевненість: {Math.round(result.confidence * 100)}%)</span>
              Перевірте дані перед збереженням. AI іноді помиляється, тому ви можете відредагувати будь-яке поле.
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Що це?</label>
            <input name="name" type="text" required defaultValue={result.name} className="w-full bg-(--input) border-none rounded-xl px-4 py-3 font-semibold" />
          </div>

          {mode === 'label' && (
            <div className="flex flex-col gap-1.5 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mb-2">
              <label className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Скільки грамів/мл ви з&apos;їли?
              </label>
              <p className="text-xs text-orange-700/70 dark:text-orange-300/70 mb-2">
                Калорії нижче вказані на 100г і будуть автоматично перераховані.
              </p>
              <input 
                type="number" 
                value={portion} 
                onChange={(e) => setPortion(Number(e.target.value))}
                className="w-full bg-white dark:bg-black/20 border-none rounded-xl px-4 py-3 font-semibold" 
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Підсумкова вага (г)</label>
            <input name="weight" type="number" required defaultValue={mode === 'label' ? portion : result.weight_g} className="w-full bg-(--input) border-none rounded-xl px-4 py-3" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium opacity-80 pl-1">Калорії (ккал)</label>
            <input name="calories" type="number" required value={Math.round(result.calories * multiplier)} onChange={(e) => setResult({...result, calories: Number(e.target.value) / multiplier})} className="w-full bg-(--input) border-none rounded-xl px-4 py-3 text-xl font-bold text-(--accent)" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Білки</label>
              <input name="protein" type="number" step="0.1" required value={Math.round(result.protein_g * multiplier * 10)/10} onChange={(e) => setResult({...result, protein_g: Number(e.target.value) / multiplier})} className="w-full bg-(--input) rounded-xl px-4 py-3" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Жири</label>
              <input name="fat" type="number" step="0.1" required value={Math.round(result.fat_g * multiplier * 10)/10} onChange={(e) => setResult({...result, fat_g: Number(e.target.value) / multiplier})} className="w-full bg-(--input) rounded-xl px-4 py-3" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-80 pl-1">Вуглеводи</label>
              <input name="carbs" type="number" step="0.1" required value={Math.round(result.carbs_g * multiplier * 10)/10} onChange={(e) => setResult({...result, carbs_g: Number(e.target.value) / multiplier})} className="w-full bg-(--input) rounded-xl px-4 py-3" />
            </div>
          </div>

          <button 
            disabled={isSaving}
            type="submit" 
            className="w-full bg-(--accent) text-(--accent-foreground) py-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity mt-4 flex items-center justify-center disabled:opacity-70 mb-10"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Зберегти у щоденник'}
          </button>
          
          {mode === 'label' && (
            <button 
              type="button"
              disabled={isSaving}
              onClick={handleAskAI}
              className="w-full bg-(--input) text-(--foreground) py-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity mb-10 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <MessageSquare className="w-5 h-5 opacity-70" />
              Запитати в AI чи можна це їсти
            </button>
          )}
        </form>
      )}
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center flex-1 min-h-[100dvh]"><Loader2 className="w-8 h-8 animate-spin text-(--accent) opacity-50" /></div>}>
      <ScanContent />
    </Suspense>
  )
}

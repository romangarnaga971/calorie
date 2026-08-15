import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-(--background) text-(--foreground) animate-in">
      <div className="w-16 h-16 bg-(--accent)/10 rounded-2xl flex items-center justify-center text-(--accent) mb-4">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <p className="opacity-60 font-medium">Завантаження...</p>
    </div>
  )
}

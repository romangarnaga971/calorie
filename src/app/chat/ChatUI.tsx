'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2, Send } from 'lucide-react'

type Message = {
  id?: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatUI({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', content: "Вибачте, сталася помилка з'єднання." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-3">
            <div className="w-16 h-16 bg-(--accent) rounded-full flex items-center justify-center text-white">AI</div>
            <p className="text-center text-sm">
              Привіт! Я ваш персональний консультант.<br/>
              Запитайте мене про ваш прогрес, дієту чи поради!
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-(--accent) text-(--accent-foreground) rounded-br-none' 
                  : 'bg-(--input) text-(--foreground) rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-(--input) rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-(--foreground) opacity-40 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-(--foreground) opacity-40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-(--foreground) opacity-40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-(--card) border-t border-(--border) pb-8">
        <form onSubmit={handleSend} className="flex items-center gap-3 bg-(--input) rounded-full p-1.5 pl-5 shadow-sm focus-within:ring-2 ring-(--accent) transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишіть повідомлення..." 
            className="flex-1 bg-transparent border-none outline-none text-(--foreground) placeholder:text-(--foreground)/40"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-3 bg-(--accent) text-(--accent-foreground) rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:hover:opacity-50"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  )
}

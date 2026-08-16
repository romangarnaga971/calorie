'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Message = {
  id?: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatUI({ initialMessages, sessionId }: { initialMessages: Message[], sessionId: string }) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      
      if (data.fallbackUsed) {
        toast.info('Використано базову модель (3.5 Flash Lite) через високе навантаження.')
      }

      // Refresh the page data so the sidebar updates its title/sorting
      router.refresh()
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', content: "Вибачте, сталася помилка з'єднання." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-(--background) min-h-0">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-60 space-y-4">
            <div className="w-16 h-16 bg-(--accent)/10 rounded-full flex items-center justify-center text-(--accent)">
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="text-center text-sm font-medium">
              Привіт! Я ваш AI Консультант.<br/>
              Запитайте мене про дієту, норму калорій чи тренування.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-(--accent)/10 text-(--accent) flex items-center justify-center shrink-0 mr-3 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            
            <div 
              className={`max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user' 
                  ? 'bg-(--input) text-(--foreground) rounded-2xl px-5 py-3' 
                  : 'text-(--foreground) pt-1'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-(--input) prose-pre:text-(--foreground)">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="w-8 h-8 rounded-full bg-(--accent)/10 text-(--accent) flex items-center justify-center shrink-0 mr-3 mt-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="pt-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-(--foreground) opacity-40 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-(--foreground) opacity-40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-(--foreground) opacity-40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-(--background) border-t border-(--border)">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSend} 
            className="flex items-end gap-2 bg-(--input) border border-(--border) rounded-3xl p-2 pl-4 focus-within:ring-2 ring-(--accent)/50 transition-all shadow-sm"
          >
            <textarea 
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Запитайте щось..." 
              className="flex-1 bg-transparent border-none outline-none text-(--foreground) placeholder:opacity-50 resize-none py-3 max-h-[120px] overflow-y-auto text-sm md:text-base"
              rows={1}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="p-3 mb-0.5 bg-(--accent) text-(--accent-foreground) rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:hover:opacity-40 shrink-0"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] opacity-40">AI може робити помилки. Перевіряйте важливу інформацію.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

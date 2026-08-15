'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setRegistration(reg)
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
              setIsSubscribed(true)
              setSubscription(sub)
            }
            setIsLoading(false)
          }).catch((err) => {
            console.error(err)
            setIsLoading(false)
          })
        } else {
          setIsLoading(false)
          setError('Service Worker не знайдено (PWA вимкнено в Dev режимі?)')
        }
      }).catch(err => {
        setIsLoading(false)
        setError(err.message)
      })
    } else {
      setIsLoading(false)
      setError('Push сповіщення не підтримуються вашим браузером')
    }
  }, [])

  const subscribeButtonOnClick = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!registration) throw new Error('Service Worker not ready')
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })

      // Send to server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub)
      })

      if (!res.ok) throw new Error('Failed to save subscription')

      setSubscription(sub)
      setIsSubscribed(true)
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe')
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribeButtonOnClick = async () => {
    setIsLoading(true)
    try {
      if (subscription) {
        await subscription.unsubscribe()
        // Optionally, send a request to the server to delete it there
      }
      setSubscription(null)
      setIsSubscribed(false)
    } catch (err: any) {
      setError(err.message || 'Failed to unsubscribe')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-(--accent)/10 text-(--accent) rounded-lg">
          {isSubscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div>
          <p className="font-medium">Нагадування (Push)</p>
          <p className="text-xs opacity-60">
            {isSubscribed ? 'Увімкнено' : 'Вимкнено'}
          </p>
        </div>
      </div>
      <button
        onClick={isSubscribed ? unsubscribeButtonOnClick : subscribeButtonOnClick}
        disabled={isLoading}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
          isSubscribed 
            ? 'bg-(--input) text-(--foreground) hover:opacity-80' 
            : 'bg-(--accent) text-(--accent-foreground) hover:opacity-90 shadow-sm'
        }`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSubscribed ? 'Вимкнути' : 'Увімкнути'}
      </button>
    </div>
  )
}

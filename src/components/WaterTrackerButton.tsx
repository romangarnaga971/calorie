'use client'

import { useState, useRef, useEffect } from 'react'
import { Droplet } from 'lucide-react'

interface WaterTrackerButtonProps {
  onAdd: (amount: number) => void
  disabled?: boolean
}

export function WaterTrackerButton({ onAdd, disabled }: WaterTrackerButtonProps) {
  const [amount, setAmount] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [isAnimatingDrop, setIsAnimatingDrop] = useState(false)
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Fill speed: 5ml every 10ms = 500ml per second
  const FILL_SPEED_MS = 10
  const FILL_AMOUNT_STEP = 5

  const startHolding = () => {
    if (disabled || isAnimatingDrop) return
    setIsHolding(true)
    setAmount(0)
    
    // Clear any existing interval
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    
    holdIntervalRef.current = setInterval(() => {
      setAmount(prev => {
        // Cap at 1000ml per hold
        if (prev >= 1000) {
          clearInterval(holdIntervalRef.current!)
          return 1000
        }
        return prev + FILL_AMOUNT_STEP
      })
    }, FILL_SPEED_MS)
  }

  const stopHolding = () => {
    if (!isHolding) return
    setIsHolding(false)
    
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }

    if (amount > 0) {
      // Magnetic rounding to nearest 50ml
      const roundedAmount = Math.max(50, Math.round(amount / 50) * 50)
      setAmount(roundedAmount)
      
      // Trigger drop animation and add
      setIsAnimatingDrop(true)
      setTimeout(() => {
        onAdd(roundedAmount)
        setAmount(0)
        setIsAnimatingDrop(false)
      }, 500) // 500ms drop animation
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    }
  }, [])

  // Disable context menu to prevent iOS long-press text selection/popup
  const preventDefault = (e: any) => e.preventDefault()

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[300px]">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Трекер води</h3>
        <p className="text-(--foreground) opacity-60 text-sm">
          Затисніть бульку, щоб додати воду.<br/>Відпустіть, щоб зберегти.
        </p>
      </div>

      {/* The main hold-to-fill bubble */}
      <button
        onPointerDown={startHolding}
        onPointerUp={stopHolding}
        onPointerLeave={stopHolding}
        onContextMenu={preventDefault}
        disabled={disabled || isAnimatingDrop}
        className="relative w-40 h-40 rounded-full bg-blue-500/10 border-4 border-blue-500/30 overflow-hidden shadow-lg transition-transform active:scale-95 touch-none select-none flex items-center justify-center disabled:opacity-50"
      >
        {/* Water fill background */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-75 ease-linear"
          style={{ height: `${(amount / 1000) * 100}%` }}
        />
        
        {/* Animated wave effect (SVG) */}
        {amount > 0 && amount < 1000 && (
          <div 
            className="absolute left-0 right-0 h-4 opacity-50 bg-blue-400"
            style={{ 
              bottom: `${(amount / 1000) * 100}%`,
              transform: 'translateY(50%)'
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-blue-600 dark:text-blue-300">
          <Droplet className={`w-10 h-10 mb-1 transition-transform ${isHolding ? 'scale-110' : ''}`} fill="currentColor" />
          <span className="font-bold text-2xl drop-shadow-md">
            {amount > 0 ? `${amount} мл` : 'Затисни'}
          </span>
        </div>
      </button>

      {/* The flying droplet animation */}
      {isAnimatingDrop && (
        <div 
          className="absolute pointer-events-none z-50 text-blue-500"
          style={{
            animation: 'fly-up-drop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            top: '50%'
          }}
        >
          <Droplet className="w-12 h-12" fill="currentColor" />
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fly-up-drop {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0.5);
            opacity: 0;
          }
        }
      `}} />
    </div>
  )
}

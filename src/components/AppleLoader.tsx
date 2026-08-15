'use client'

import React from 'react'

export function AppleLoader() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center drop-shadow-lg">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bite {
          0%, 10% { transform: scale(0); opacity: 0; }
          15%, 80% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        /* Sequential bites around the apple */
        .apple-bite-1 { animation: bite 4s infinite 0.5s; transform-origin: center; transform-box: fill-box; }
        .apple-bite-2 { animation: bite 4s infinite 1.2s; transform-origin: center; transform-box: fill-box; }
        .apple-bite-3 { animation: bite 4s infinite 1.9s; transform-origin: center; transform-box: fill-box; }
        .apple-bite-4 { animation: bite 4s infinite 2.6s; transform-origin: center; transform-box: fill-box; }
        .apple-bite-5 { animation: bite 4s infinite 3.3s; transform-origin: center; transform-box: fill-box; }
        
        @keyframes apple-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .apple-animate { animation: apple-bounce 2s ease-in-out infinite; }
      `}} />
      <svg viewBox="0 0 100 100" className="w-full h-full apple-animate overflow-visible">
        <defs>
          <mask id="bite-mask">
            {/* White means visible */}
            <rect x="-20" y="-20" width="140" height="140" fill="white" />
            {/* Black means transparent (the bites) */}
            <circle cx="85" cy="40" r="16" fill="black" className="apple-bite-1" style={{ transform: 'scale(0)' }} />
            <circle cx="75" cy="68" r="18" fill="black" className="apple-bite-2" style={{ transform: 'scale(0)' }} />
            <circle cx="50" cy="82" r="18" fill="black" className="apple-bite-3" style={{ transform: 'scale(0)' }} />
            <circle cx="25" cy="65" r="18" fill="black" className="apple-bite-4" style={{ transform: 'scale(0)' }} />
            <circle cx="20" cy="38" r="16" fill="black" className="apple-bite-5" style={{ transform: 'scale(0)' }} />
          </mask>
        </defs>

        <g mask="url(#bite-mask)">
          {/* Apple Body */}
          <path d="M50,90 C15,90 15,55 15,40 C15,20 30,15 45,15 C48,15 50,17 50,17 C50,17 52,15 55,15 C70,15 85,20 85,40 C85,55 85,90 50,90 Z" fill="#ef4444" />
          
          {/* Stem */}
          <path d="M50,17 Q50,0 55,-5" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
          
          {/* Leaf */}
          <path d="M55,-5 C70,-10 75,5 75,5 C75,5 60,10 55,-5 Z" fill="#22c55e" />
          
          {/* Inner Core (visible when fully bitten, simulating the shape left behind) */}
          <path d="M48,25 C45,40 45,60 48,75 M52,25 C55,40 55,60 52,75" stroke="#fef08a" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="2 2"/>
          
          {/* Highlight/Gloss */}
          <path d="M25,40 Q25,30 35,22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
        </g>
      </svg>
    </div>
  )
}

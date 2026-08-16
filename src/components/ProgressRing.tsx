import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  label: string;
  value: number;
  total: number;
  color?: string;
}

export function ProgressRing({ progress, size = 180, strokeWidth = 14, label, value, total, color = "var(--accent)" }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Cap progress at 1 for the visual ring
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const offset = circumference - safeProgress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          stroke="var(--input)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Ring */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-(--foreground)">{value}</span>
        <span className="text-sm text-(--foreground) opacity-60">/ {total} {label}</span>
      </div>
    </div>
  );
}

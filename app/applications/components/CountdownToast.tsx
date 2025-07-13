"use client";

import { useEffect, useRef, useState } from "react";

interface CountdownToastProps {
  seconds?: number;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CountdownToast({
  seconds = 5,
  onComplete,
  onCancel,
}: CountdownToastProps) {
  const [count, setCount] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (count <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
    }
  }, [count, onComplete]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (count / seconds) * circumference;

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-3">
        <svg className="w-10 h-10" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 25 25)"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-sm fill-red-500 font-semibold"
          >
            {count}
          </text>
        </svg>
        <span className="text-sm">Deleting in {count} seconds...</span>
      </div>
      <button
        className="text-xs px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
        onClick={onCancel}
      >
        Undo
      </button>
    </div>
  );
}

"use client"

import { cn } from "@/lib/utils"

const TIMING_OPTIONS = [
  { label: "A tiempo", value: "a tiempo" },
  { label: "Adelantado", value: "adelantado" },
  { label: "Retrasado", value: "retrasado" },
]

export default function ProjectTimingFilter({ timingFilter, setTimingFilter }) {
  return (
    <div className="flex gap-2">
      {TIMING_OPTIONS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setTimingFilter(timingFilter === value ? null : value)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium border shadow-sm flex items-center gap-2",
            "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-white border-indigo-300 dark:border-white hover:bg-indigo-200 dark:hover:bg-indigo-800",
            timingFilter === value &&
              "bg-indigo-300 dark:bg-indigo-700 text-black dark:text-white"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          {label}
        </button>
      ))}
    </div>
  )
}

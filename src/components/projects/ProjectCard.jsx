"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconPin,
  IconPinFilled,
  IconArchive,
  IconArchiveOff,
  IconArrowRight,
} from "@tabler/icons-react"



export default function ProjectCard({
  id,
  name,
  client,
  status,
  deadline,
  createdAt,
  tasks,
  progress,
  timing,
  pinned,
  archived = false,
}) {
  const router = useRouter()
  const [isPinned, setIsPinned] = useState(pinned)
  const [isArchived, setIsArchived] = useState(archived)

  const handlePinClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPinned(!isPinned)
  }

  const handleArchiveClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsArchived(!isArchived)
  }

  const daysRemaining = Math.max(
    0,
    Math.floor((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  )

  const nextTask = Array.isArray(tasks)
    ? tasks
        .filter((t) => !t.completed)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
    : null

  const getTimingColor = () => {
    return timing === "retrasado"
      ? "bg-red-500"
      : timing === "adelantado"
      ? "bg-green-500"
      : "bg-yellow-400"
  }

  const getTaskDaysRemaining = (task) =>
    Math.max(
      0,
      Math.floor((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    )

  const isInactive = status === "completado" || status === "cancelado"

  return (
    <article
      onClick={() => router.push(`/projects/${id}`)}
      className={`relative w-full max-w-md border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer ${
        isInactive
          ? "bg-indigo-100 dark:bg-indigo-900 opacity-80"
          : "bg-white dark:bg-indigo-950"
      } ${
        isArchived ? "opacity-50 grayscale relative" : ""
      } border-indigo-300 dark:border-indigo-700`}
    >
      {/* Capa archivado */}
      {isArchived && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center pointer-events-none">
          <IconArchive size={28} className="text-white opacity-80" />
        </div>
      )}

      {/* Botones */}
      <div className="absolute top-3 right-3 z-30 flex gap-2">
        <button
          onClick={handlePinClick}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
            isPinned
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-white dark:bg-indigo-900 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300"
          }`}
        >
          {isPinned ? <IconPinFilled size={16} /> : <IconPin size={16} />}
        </button>
        <button
          onClick={handleArchiveClick}
          className="w-8 h-8 rounded-full border flex items-center justify-center transition bg-white dark:bg-indigo-900 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300"
        >
          {isArchived ? (
            <IconArchiveOff size={16} />
          ) : (
            <IconArchive size={16} />
          )}
        </button>
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-4 flex flex-col gap-2">
        <h2 className="text-base font-semibold text-indigo-800 dark:text-white leading-snug overflow-hidden ">
          {name}
        </h2>

        <p className="text-sm text-indigo-700 dark:text-indigo-300 -mt-1">
          {client}
        </p>

        <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
          <span>Avance</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-indigo-200 dark:bg-indigo-800 rounded-sm overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-indigo-600 dark:bg-indigo-300 transition-all"
          />
        </div>

        {!isInactive && (
          <div className="text-xs text-indigo-700 dark:text-indigo-300">
            Entrega en {daysRemaining} días
          </div>
        )}

        {!isInactive && (
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${getTimingColor()}`} />
            <span className="text-xs capitalize text-indigo-700 dark:text-indigo-300">
              {timing}
            </span>
          </div>
        )}

        {nextTask && !isInactive && (
          <div className="mt-3">
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-indigo-700 dark:bg-indigo-300 text-white dark:text-indigo-900 text-sm font-medium shadow hover:opacity-90 transition"
            >
              <div className="flex items-center gap-2 truncate">
                <IconArrowRight size={16} className="shrink-0" />
                <span className="truncate">{nextTask.title}</span>
              </div>
              <span className="text-[11px] opacity-80 whitespace-nowrap">
                {getTaskDaysRemaining(nextTask)} días
              </span>
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

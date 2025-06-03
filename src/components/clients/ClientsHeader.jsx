"use client"

import { IconPlus } from "@tabler/icons-react"

export default function ClientsHeader({ onAddClick }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-semibold text-indigo-800 dark:text-indigo-100">
        Clientes
      </h1>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white dark:text-indigo-950 bg-indigo-700 dark:bg-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-200 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-indigo-950"
      >
        <IconPlus size={16} />
        Nuevo cliente
      </button>
    </div>
  )
}

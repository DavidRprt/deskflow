"use client"

import { IconPlus, IconSearch } from "@tabler/icons-react"
import ClientCard from "@/components/clients/ClientCard"
import { clients } from "@/data/clients"
import NewClientForm from "@/components/clients/NewClientForm"
import { useState } from "react"

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-indigo-950 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold text-indigo-800 dark:text-indigo-100 mb-6">
          Clientes
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white dark:text-indigo-950 bg-indigo-700 dark:bg-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-200 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-indigo-950"
        >
          <IconPlus size={16} />
          Nuevo cliente
        </button>
      </div>

      {showForm && <NewClientForm onClose={() => setShowForm(false)} />}

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-white dark:bg-background">
          <IconSearch size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full bg-transparent text-sm outline-none text-foreground placeholder-muted"
          />
        </div>
      </div>

      {/* Grid de clientes */}
      <ClientCard clients={clients} />
    </div>
  )
}

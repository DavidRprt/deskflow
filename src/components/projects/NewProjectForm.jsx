"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { createProjectAction } from "@/actions/projectActions"

export default function NewProjectForm({ onClose, clientes, tiposProyecto }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    const result = await createProjectAction(formData)

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-indigo-900 rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-100 dark:border-indigo-800">
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">
            Nuevo Proyecto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre del proyecto *
            </label>
            <input
              type="text"
              name="nombre"
              required
              minLength={2}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-300 dark:border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-950 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cliente *
            </label>
            <select
              name="cliente_id"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-950 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de proyecto *
            </label>
            <select
              name="tipo_proyecto_id"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-950 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar tipo</option>
              {tiposProyecto.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha límite
            </label>
            <input
              type="date"
              name="fecha_limite"
              className="w-full px-3 py-2 border border-gray-300 dark:border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-950 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Presupuesto estimado
            </label>
            <input
              type="number"
              name="presupuesto"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-950 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-indigo-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-indigo-900/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

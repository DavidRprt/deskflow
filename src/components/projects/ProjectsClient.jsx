"use client"

import { useState } from "react"
import { Plus, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ProjectCard from "./ProjectCard"
import NewProjectForm from "./NewProjectForm"

export default function ProjectsClient({ projects, clientes, tiposProyecto }) {
  const [showForm, setShowForm] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const filteredProjects = showArchived
    ? projects
    : projects.filter((p) => !p.archivado)

  const archivedCount = projects.filter((p) => p.archivado).length

  return (
    <div className="min-h-screen bg-white dark:bg-indigo-950 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold text-indigo-800 dark:text-indigo-100">
          Proyectos
        </h1>
        <div className="flex items-center gap-3">
          {archivedCount > 0 && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors"
            >
              {showArchived ? <EyeOff size={16} /> : <Eye size={16} />}
              {showArchived
                ? "Ocultar archivados"
                : `Mostrar archivados (${archivedCount})`}
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white dark:text-indigo-950 bg-indigo-700 dark:bg-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-200 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus size={16} />
            Nuevo proyecto
          </button>
        </div>
      </div>

      {showForm && (
        <NewProjectForm
          onClose={() => setShowForm(false)}
          clientes={clientes}
          tiposProyecto={tiposProyecto}
        />
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {showArchived
            ? "No hay proyectos archivados"
            : "No hay proyectos. Crea uno nuevo para comenzar."}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  layout: { duration: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconUser,
  IconCalendar,
  IconCash,
  IconArchive,
  IconPin,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconLoader2,
  IconFlag,
} from "@tabler/icons-react"
import {
  toggleArchivarAction,
  toggleFijarAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/actions/projectActions"
import {
  createTaskAction,
  completeTaskAction,
  reopenTaskAction,
  deleteTaskAction,
} from "@/actions/taskActions"

export default function ProjectDetailClient({ project, estados }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleArchive = async () => {
    await toggleArchivarAction(project.id)
    router.refresh()
  }

  const handlePin = async () => {
    await toggleFijarAction(project.id)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto y todas sus tareas?")) return

    setIsDeleting(true)
    try {
      const result = await deleteProjectAction(project.id)
      if (result.success) {
        router.push("/proyectos")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (newStatusId) => {
    await updateProjectAction(project.id, { estado_id: newStatusId })
    router.refresh()
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskName.trim()) return

    setIsAddingTask(true)
    try {
      await createTaskAction({
        nombre: newTaskName.trim(),
        proyecto_id: project.id,
        estado_id: 1,
        importancia: 3,
      })
      setNewTaskName("")
      setShowAddTask(false)
      router.refresh()
    } finally {
      setIsAddingTask(false)
    }
  }

  const handleToggleTask = async (task) => {
    if (task.estado_id === 4) {
      await reopenTaskAction(task.id)
    } else {
      await completeTaskAction(task.id)
    }
    router.refresh()
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm("¿Eliminar esta tarea?")) return
    await deleteTaskAction(taskId, project.id)
    router.refresh()
  }

  const completedTasks = project.tareas?.filter((t) => t.estado_id === 4) || []
  const pendingTasks = project.tareas?.filter((t) => t.estado_id !== 4) || []
  const progress = project.tareas?.length
    ? Math.round((completedTasks.length / project.tareas.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/proyectos"
          className="p-2 rounded-lg hover:bg-secondary transition"
        >
          <IconArrowLeft size={20} className="text-muted" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-heading">
              {project.nombre}
            </h1>
            {project.fijado && (
              <IconPin size={20} className="text-primary" />
            )}
            {project.archivado && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                Archivado
              </span>
            )}
          </div>
          {project.cliente && (
            <p className="text-muted">{project.cliente.nombre}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePin}
            className={`p-2 rounded-lg transition ${
              project.fijado
                ? "bg-primary text-white"
                : "hover:bg-secondary text-muted"
            }`}
            title={project.fijado ? "Desfijar" : "Fijar"}
          >
            <IconPin size={18} />
          </button>
          <button
            onClick={handleArchive}
            className={`p-2 rounded-lg transition ${
              project.archivado
                ? "bg-amber-500 text-white"
                : "hover:bg-secondary text-muted"
            }`}
            title={project.archivado ? "Desarchivar" : "Archivar"}
          >
            <IconArchive size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition disabled:opacity-50"
            title="Eliminar"
          >
            {isDeleting ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconTrash size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Principal */}
        <div className="lg:col-span-1 space-y-6">
          {/* Estado */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Estado</h2>
            <select
              value={project.estado_id || ""}
              onChange={(e) => handleStatusChange(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground"
            >
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Detalles */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Detalles</h2>
            <div className="space-y-4">
              {project.cliente && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconUser size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Cliente</p>
                    <Link
                      href={`/clientes/${project.cliente.id}`}
                      className="text-heading hover:text-primary transition"
                    >
                      {project.cliente.nombre}
                    </Link>
                  </div>
                </div>
              )}
              {project.fecha_inicio && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconCalendar size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Fecha inicio</p>
                    <p className="text-heading">
                      {new Date(project.fecha_inicio).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              )}
              {project.fecha_limite && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <IconFlag size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Fecha limite</p>
                    <p className="text-heading">
                      {new Date(project.fecha_limite).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              )}
              {project.presupuesto && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <IconCash size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Presupuesto</p>
                    <p className="text-heading">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(project.presupuesto)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progreso */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Progreso</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">
                {completedTasks.length} de {project.tareas?.length || 0} tareas
              </span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">Tareas</h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <IconPlus size={16} /> Nueva tarea
              </button>
            </div>

            {/* Form para agregar tarea */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Nombre de la tarea..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  disabled={isAddingTask}
                />
                <button
                  type="submit"
                  disabled={isAddingTask || !newTaskName.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {isAddingTask ? (
                    <IconLoader2 size={18} className="animate-spin" />
                  ) : (
                    <IconCheck size={18} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false)
                    setNewTaskName("")
                  }}
                  className="px-4 py-2 text-muted hover:bg-secondary rounded-lg"
                >
                  <IconX size={18} />
                </button>
              </form>
            )}

            {/* Lista de tareas pendientes */}
            {pendingTasks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted mb-3">
                  Pendientes ({pendingTasks.length})
                </h3>
                <ul className="space-y-2">
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggleTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* Lista de tareas completadas */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted mb-3">
                  Completadas ({completedTasks.length})
                </h3>
                <ul className="space-y-2">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggleTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                      completed
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* Empty state */}
            {(!project.tareas || project.tareas.length === 0) && !showAddTask && (
              <div className="text-center py-12">
                <p className="text-muted mb-2">No hay tareas en este proyecto</p>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="text-primary hover:underline text-sm"
                >
                  Agregar primera tarea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ task, onToggle, onDelete, completed }) {
  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition group ${
        completed ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded border flex items-center justify-center transition ${
          completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-border hover:border-primary"
        }`}
      >
        {completed && <IconCheck size={14} />}
      </button>
      <div className="flex-1">
        <p className={`text-heading ${completed ? "line-through" : ""}`}>
          {task.nombre}
        </p>
        {task.fecha_limite && (
          <p className="text-xs text-muted">
            Vence: {new Date(task.fecha_limite).toLocaleDateString("es-AR")}
          </p>
        )}
      </div>
      {task.importancia >= 4 && (
        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
          Alta
        </span>
      )}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition"
      >
        <IconTrash size={16} />
      </button>
    </li>
  )
}

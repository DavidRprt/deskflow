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
  IconClock,
  IconAlertTriangle,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconReceipt,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react"
import {
  toggleArchivarAction,
  toggleFijarAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/actions/projectActions"
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/actions/taskActions"
import {
  createGastoAction,
  deleteGastoAction,
} from "@/actions/financeActions"

export default function ProjectDetailClient({ project, estados, monedas = [] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("tareas")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showGastoForm, setShowGastoForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Calcular finanzas del proyecto
  const presupuesto = parseFloat(project.presupuesto) || 0
  const totalGastos = project.gastos?.reduce((sum, g) => sum + parseFloat(g.monto), 0) || 0
  const gananciaNeta = presupuesto - totalGastos
  const porcentajeGastado = presupuesto > 0 ? (totalGastos / presupuesto) * 100 : 0

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

  // Ordenar tareas por fecha de inicio para timeline
  const sortedTasks = [...(project.tareas || [])].sort((a, b) => {
    if (!a.fecha_inicio && !b.fecha_inicio) return 0
    if (!a.fecha_inicio) return 1
    if (!b.fecha_inicio) return -1
    return new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
  })

  const completedTasks = sortedTasks.filter((t) => t.estado_id === 4)
  const pendingTasks = sortedTasks.filter((t) => t.estado_id !== 4)

  // Calcular progreso ponderado por importancia
  const totalImportancia = sortedTasks.reduce((sum, t) => sum + (t.importancia || 1), 0)
  const completedImportancia = completedTasks.reduce((sum, t) => sum + (t.importancia || 1), 0)
  const progress = totalImportancia > 0 ? Math.round((completedImportancia / totalImportancia) * 100) : 0

  // Calcular horas totales
  const totalHoras = sortedTasks.reduce((sum, t) => sum + (t.duracion_estimada || 0), 0)
  const horasCompletadas = completedTasks.reduce((sum, t) => sum + (t.duracion_estimada || 0), 0)

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/proyectos" className="p-2 rounded-lg hover:bg-secondary transition">
          <IconArrowLeft size={20} className="text-muted" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-heading">{project.nombre}</h1>
            {project.fijado && <IconPin size={20} className="text-primary" />}
            {project.archivado && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                Archivado
              </span>
            )}
          </div>
          {project.cliente && <p className="text-muted">{project.cliente.nombre}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePin} className={`p-2 rounded-lg transition ${project.fijado ? "bg-primary text-white" : "hover:bg-secondary text-muted"}`}>
            <IconPin size={18} />
          </button>
          <button onClick={handleArchive} className={`p-2 rounded-lg transition ${project.archivado ? "bg-amber-500 text-white" : "hover:bg-secondary text-muted"}`}>
            <IconArchive size={18} />
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition disabled:opacity-50">
            {isDeleting ? <IconLoader2 size={18} className="animate-spin" /> : <IconTrash size={18} />}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Progreso" value={`${progress}%`} sub={`${completedTasks.length}/${sortedTasks.length} tareas`} color="primary" />
        <StatCard label="Horas Est." value={`${horasCompletadas}/${totalHoras}h`} sub="completadas" color="blue" />
        <StatCard label="Presupuesto" value={formatCurrency(presupuesto)} sub={project.pagado ? "Pagado" : "Pendiente"} color="green" />
        <StatCard
          label="Ganancia Neta"
          value={formatCurrency(gananciaNeta)}
          sub={`${porcentajeGastado.toFixed(0)}% gastado`}
          color={gananciaNeta >= 0 ? "emerald" : "red"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
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
                <option key={estado.id} value={estado.id}>{estado.nombre}</option>
              ))}
            </select>
          </div>

          {/* Detalles */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Detalles</h2>
            <div className="space-y-4">
              {project.cliente && (
                <DetailRow icon={<IconUser size={18} />} label="Cliente" color="primary">
                  <Link href={`/clientes/${project.cliente.id}`} className="text-heading hover:text-primary transition">
                    {project.cliente.nombre}
                  </Link>
                </DetailRow>
              )}
              {project.fecha_inicio && (
                <DetailRow icon={<IconCalendar size={18} />} label="Inicio" color="primary">
                  {new Date(project.fecha_inicio).toLocaleDateString("es-AR")}
                </DetailRow>
              )}
              {project.fecha_limite && (
                <DetailRow icon={<IconFlag size={18} />} label="Limite" color="amber">
                  {new Date(project.fecha_limite).toLocaleDateString("es-AR")}
                </DetailRow>
              )}
            </div>
          </div>

          {/* Barra de Progreso Visual */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Progreso por Importancia</h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((imp) => {
                const tasksWithImp = sortedTasks.filter((t) => t.importancia === imp)
                const completedWithImp = tasksWithImp.filter((t) => t.estado_id === 4)
                const pct = tasksWithImp.length > 0 ? (completedWithImp.length / tasksWithImp.length) * 100 : 0
                if (tasksWithImp.length === 0) return null
                return (
                  <div key={imp}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Importancia {imp}</span>
                      <span className="text-heading">{completedWithImp.length}/{tasksWithImp.length}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${getImportanceColor(imp)}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            <TabButton active={activeTab === "tareas"} onClick={() => setActiveTab("tareas")}>
              Tareas ({sortedTasks.length})
            </TabButton>
            <TabButton active={activeTab === "timeline"} onClick={() => setActiveTab("timeline")}>
              Timeline
            </TabButton>
            <TabButton active={activeTab === "finanzas"} onClick={() => setActiveTab("finanzas")}>
              Finanzas ({project.gastos?.length || 0})
            </TabButton>
          </div>

          {/* Tab Content */}
          {activeTab === "tareas" && (
            <TasksTab
              tasks={sortedTasks}
              pendingTasks={pendingTasks}
              completedTasks={completedTasks}
              estados={estados}
              projectId={project.id}
              showForm={showTaskForm}
              setShowForm={setShowTaskForm}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              router={router}
            />
          )}

          {activeTab === "timeline" && (
            <TimelineTab tasks={sortedTasks} project={project} />
          )}

          {activeTab === "finanzas" && (
            <FinanzasTab
              project={project}
              monedas={monedas}
              presupuesto={presupuesto}
              totalGastos={totalGastos}
              gananciaNeta={gananciaNeta}
              showForm={showGastoForm}
              setShowForm={setShowGastoForm}
              router={router}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== COMPONENTS ====================

function StatCard({ label, value, sub, color }) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  }
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[color]?.split(" ")[1] || "text-heading"}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{sub}</p>
    </div>
  )
}

function DetailRow({ icon, label, color, children }) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  }
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-heading">{children}</p>
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
        active ? "border-primary text-primary" : "border-transparent text-muted hover:text-heading"
      }`}
    >
      {children}
    </button>
  )
}

// ==================== TASKS TAB ====================

function TasksTab({ tasks, pendingTasks, completedTasks, estados, projectId, showForm, setShowForm, editingTask, setEditingTask, router }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-heading">Gestión de Tareas</h2>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          <IconPlus size={16} /> Nueva Tarea
        </button>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          estados={estados}
          projectId={projectId}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
          router={router}
        />
      )}

      {/* Pendientes */}
      {pendingTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
            <IconClock size={16} /> Pendientes ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                estados={estados}
                onEdit={() => { setEditingTask(task); setShowForm(true) }}
                router={router}
                projectId={projectId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completadas */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
            <IconCheck size={16} /> Completadas ({completedTasks.length})
          </h3>
          <div className="space-y-3 opacity-60">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                estados={estados}
                completed
                onEdit={() => { setEditingTask(task); setShowForm(true) }}
                router={router}
                projectId={projectId}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && !showForm && (
        <div className="text-center py-12">
          <IconClock size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted mb-2">No hay tareas en este proyecto</p>
          <button onClick={() => setShowForm(true)} className="text-primary hover:underline text-sm">
            Crear primera tarea
          </button>
        </div>
      )}
    </div>
  )
}

function TaskForm({ task, estados, projectId, onClose, router }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [importancia, setImportancia] = useState(task?.importancia || 3)
  const [estadoId, setEstadoId] = useState(task?.estado_id || 1)
  const [nombre, setNombre] = useState(task?.nombre || "")
  const [fechaInicio, setFechaInicio] = useState(task?.fecha_inicio || new Date().toISOString().split("T")[0])
  const [fechaLimite, setFechaLimite] = useState(task?.fecha_limite || "")
  const isEditing = !!task

  const importanciaConfig = [
    { value: 1, label: "Muy baja", color: "bg-slate-400", ring: "ring-slate-400", text: "text-slate-600" },
    { value: 2, label: "Baja", color: "bg-blue-400", ring: "ring-blue-400", text: "text-blue-600" },
    { value: 3, label: "Media", color: "bg-amber-400", ring: "ring-amber-400", text: "text-amber-600" },
    { value: 4, label: "Alta", color: "bg-orange-500", ring: "ring-orange-500", text: "text-orange-600" },
    { value: 5, label: "Crítica", color: "bg-red-500", ring: "ring-red-500", text: "text-red-600" },
  ]

  const estadoConfig = {
    1: { icon: "○", color: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600" },
    2: { icon: "◐", color: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700" },
    3: { icon: "◉", color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700" },
    4: { icon: "●", color: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700" },
  }

  const validateForm = () => {
    const newErrors = {}

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    }

    if (fechaLimite && fechaInicio && new Date(fechaLimite) < new Date(fechaInicio)) {
      newErrors.fechaLimite = "La fecha límite no puede ser anterior a la fecha de inicio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      nombre: nombre.trim(),
      descripcion: formData.get("descripcion")?.trim() || null,
      importancia,
      duracion_estimada: formData.get("duracion_estimada") ? parseInt(formData.get("duracion_estimada")) : null,
      fecha_inicio: fechaInicio || null,
      fecha_limite: fechaLimite || null,
      estado_id: estadoId,
      proyecto_id: projectId,
    }

    try {
      if (isEditing) {
        await updateTaskAction(task.id, data)
      } else {
        await createTaskAction(data)
      }
      router.refresh()
      onClose()
    } catch (error) {
      setErrors({ submit: "Error al guardar la tarea" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-5 bg-secondary/30 rounded-xl space-y-5 border border-border">
      <h3 className="font-semibold text-heading text-lg">{isEditing ? "Editar Tarea" : "Nueva Tarea"}</h3>

      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-heading mb-1">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => { setNombre(e.target.value); setErrors({ ...errors, nombre: null }) }}
          placeholder="Nombre de la tarea"
          className={`w-full px-4 py-2.5 border rounded-lg bg-background transition ${
            errors.nombre ? "border-red-400 focus:ring-red-400" : "border-border focus:ring-primary"
          } focus:ring-2 focus:outline-none`}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-heading mb-1">Descripción</label>
        <textarea
          name="descripcion"
          rows={2}
          defaultValue={task?.descripcion}
          placeholder="Detalles de la tarea..."
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Importancia - Semáforo Visual */}
      <div>
        <label className="block text-sm font-medium text-heading mb-2">Importancia *</label>
        <div className="flex gap-2">
          {importanciaConfig.map((imp) => (
            <button
              key={imp.value}
              type="button"
              onClick={() => setImportancia(imp.value)}
              className={`flex-1 py-2.5 px-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                importancia === imp.value
                  ? `${imp.ring} ring-2 border-transparent shadow-md scale-105`
                  : "border-border hover:border-gray-400"
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${imp.color}`} />
              <span className={`text-xs font-medium ${importancia === imp.value ? imp.text : "text-muted"}`}>
                {imp.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Estado - Chips Visuales */}
      <div>
        <label className="block text-sm font-medium text-heading mb-2">Estado *</label>
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => {
            const config = estadoConfig[estado.id] || estadoConfig[1]
            return (
              <button
                key={estado.id}
                type="button"
                onClick={() => setEstadoId(estado.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                  estadoId === estado.id
                    ? `${config.color} border-current shadow-md scale-105`
                    : "border-border bg-background text-muted hover:border-gray-400"
                }`}
              >
                <span className="text-sm">{config.icon}</span>
                <span className="text-sm font-medium">{estado.nombre}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Duración (horas)</label>
          <input
            type="number"
            name="duracion_estimada"
            min={0}
            defaultValue={task?.duracion_estimada}
            placeholder="Ej: 8"
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Fecha inicio */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Fecha límite */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Fecha límite</label>
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => { setFechaLimite(e.target.value); setErrors({ ...errors, fechaLimite: null }) }}
            className={`w-full px-4 py-2.5 border rounded-lg bg-background transition ${
              errors.fechaLimite ? "border-red-400" : "border-border"
            } focus:ring-2 focus:ring-primary focus:outline-none`}
          />
          {errors.fechaLimite && <p className="text-red-500 text-xs mt-1">{errors.fechaLimite}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-border">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-muted hover:text-heading transition rounded-lg hover:bg-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 font-medium transition shadow-sm"
        >
          {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
          {isEditing ? "Guardar Cambios" : "Crear Tarea"}
        </button>
      </div>
    </form>
  )
}

function TaskCard({ task, estados, completed, onEdit, router, projectId }) {
  const [expanded, setExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleComplete = async () => {
    setIsUpdating(true)
    const newEstado = completed ? 2 : 4
    await updateTaskAction(task.id, { estado_id: newEstado })
    router.refresh()
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta tarea?")) return
    await deleteTaskAction(task.id, projectId)
    router.refresh()
  }

  const isOverdue = task.fecha_limite && new Date(task.fecha_limite) < new Date() && !completed
  const daysUntilDeadline = task.fecha_limite
    ? Math.ceil((new Date(task.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className={`border rounded-xl overflow-hidden transition ${isOverdue ? "border-red-300 bg-red-50/50 dark:bg-red-900/10" : "border-border bg-card"}`}>
      <div className="p-4 flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          disabled={isUpdating}
          className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition flex-shrink-0 ${
            completed ? "bg-green-500 border-green-500 text-white" : "border-border hover:border-primary"
          }`}
        >
          {isUpdating ? <IconLoader2 size={12} className="animate-spin" /> : completed && <IconCheck size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`font-medium text-heading ${completed ? "line-through" : ""}`}>{task.nombre}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <ImportanceBadge level={task.importancia} />
                {task.duracion_estimada && (
                  <span className="text-xs text-muted flex items-center gap-1">
                    <IconClock size={12} /> {task.duracion_estimada}h
                  </span>
                )}
                {task.fecha_limite && (
                  <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-muted"}`}>
                    <IconFlag size={12} />
                    {isOverdue ? `Vencida hace ${Math.abs(daysUntilDeadline)} días` :
                     daysUntilDeadline === 0 ? "Vence hoy" :
                     daysUntilDeadline === 1 ? "Vence mañana" :
                     `${daysUntilDeadline} días`}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setExpanded(!expanded)} className="p-1 text-muted hover:text-heading rounded">
                {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </button>
              <button onClick={onEdit} className="p-1 text-muted hover:text-primary rounded">
                <IconEdit size={16} />
              </button>
              <button onClick={handleDelete} className="p-1 text-muted hover:text-red-500 rounded">
                <IconTrash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-8 border-t border-border mt-2 pt-3">
          {task.descripcion && <p className="text-sm text-muted mb-3">{task.descripcion}</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted">Estado</p>
              <p className="text-heading">{estados.find((e) => e.id === task.estado_id)?.nombre || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Fecha inicio</p>
              <p className="text-heading">{task.fecha_inicio ? new Date(task.fecha_inicio).toLocaleDateString("es-AR") : "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Fecha límite</p>
              <p className="text-heading">{task.fecha_limite ? new Date(task.fecha_limite).toLocaleDateString("es-AR") : "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Duración</p>
              <p className="text-heading">{task.duracion_estimada ? `${task.duracion_estimada} horas` : "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ImportanceBadge({ level }) {
  const config = {
    1: { label: "Muy baja", class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    2: { label: "Baja", class: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    3: { label: "Media", class: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    4: { label: "Alta", class: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
    5: { label: "Crítica", class: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  }
  const c = config[level] || config[3]
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c.class}`}>{c.label}</span>
}

// ==================== TIMELINE TAB ====================

function TimelineTab({ tasks, project }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <IconCalendar size={48} className="mx-auto text-muted mb-4" />
        <p className="text-muted">Agrega tareas con fechas para ver el timeline</p>
      </div>
    )
  }

  const tasksWithDates = tasks.filter((t) => t.fecha_inicio || t.fecha_limite)
  const projectStart = project.fecha_inicio ? new Date(project.fecha_inicio) : null
  const projectEnd = project.fecha_limite ? new Date(project.fecha_limite) : null

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-heading mb-6">Timeline del Proyecto</h2>

      {/* Fechas del proyecto */}
      {(projectStart || projectEnd) && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
          {projectStart && (
            <div className="flex items-center gap-2">
              <IconCalendar size={16} className="text-primary" />
              <span className="text-sm">Inicio: {projectStart.toLocaleDateString("es-AR")}</span>
            </div>
          )}
          {projectEnd && (
            <div className="flex items-center gap-2">
              <IconFlag size={16} className="text-amber-600" />
              <span className="text-sm">Entrega: {projectEnd.toLocaleDateString("es-AR")}</span>
            </div>
          )}
        </div>
      )}

      {/* Timeline visual */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {tasks.map((task, idx) => {
            const completed = task.estado_id === 4
            const isOverdue = task.fecha_limite && new Date(task.fecha_limite) < new Date() && !completed

            return (
              <div key={task.id} className="relative pl-10">
                <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                  completed ? "bg-green-500 border-green-500" :
                  isOverdue ? "bg-red-500 border-red-500" :
                  "bg-background border-primary"
                }`}>
                  {completed && <IconCheck size={12} className="text-white absolute top-0.5 left-0.5" />}
                  {isOverdue && !completed && <IconAlertTriangle size={12} className="text-white absolute top-0.5 left-0.5" />}
                </div>

                <div className={`p-4 rounded-lg border ${completed ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800" : isOverdue ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800" : "bg-card border-border"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${completed ? "line-through text-muted" : "text-heading"}`}>{task.nombre}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                        {task.fecha_inicio && <span>Inicio: {new Date(task.fecha_inicio).toLocaleDateString("es-AR")}</span>}
                        {task.fecha_limite && <span>Límite: {new Date(task.fecha_limite).toLocaleDateString("es-AR")}</span>}
                        {task.duracion_estimada && <span>{task.duracion_estimada}h estimadas</span>}
                      </div>
                    </div>
                    <ImportanceBadge level={task.importancia} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==================== FINANZAS TAB ====================

function FinanzasTab({ project, monedas, presupuesto, totalGastos, gananciaNeta, showForm, setShowForm, router }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSubmitGasto = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("proyecto_id", project.id)

    await createGastoAction(formData)
    router.refresh()
    setShowForm(false)
    setIsSubmitting(false)
  }

  const handleDeleteGasto = async (id) => {
    if (!confirm("¿Eliminar este gasto?")) return
    setDeleting(id)
    await deleteGastoAction(id)
    router.refresh()
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      {/* Resumen financiero */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">Resumen Financiero</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <IconTrendingUp size={24} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{formatCurrency(presupuesto)}</p>
            <p className="text-xs text-muted">Presupuesto</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <IconTrendingDown size={24} className="mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalGastos)}</p>
            <p className="text-xs text-muted">Gastos</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${gananciaNeta >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
            <IconCash size={24} className={`mx-auto mb-2 ${gananciaNeta >= 0 ? "text-emerald-600" : "text-red-600"}`} />
            <p className={`text-2xl font-bold ${gananciaNeta >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(gananciaNeta)}
            </p>
            <p className="text-xs text-muted">Ganancia Neta</p>
          </div>
        </div>

        {/* Barra de gastos */}
        {presupuesto > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Gastos sobre presupuesto</span>
              <span className={totalGastos > presupuesto ? "text-red-600" : "text-heading"}>
                {((totalGastos / presupuesto) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${totalGastos > presupuesto ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${Math.min((totalGastos / presupuesto) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Gastos del proyecto */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-heading">Gastos del Proyecto</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <IconPlus size={16} /> Agregar Gasto
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmitGasto} className="mb-6 p-4 bg-secondary/30 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Monto *</label>
                <input type="number" name="monto" step="0.01" min="0.01" required className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Fecha *</label>
                <input type="date" name="fecha" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Moneda *</label>
                <select name="moneda_id" required className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                  {monedas.map((m) => (
                    <option key={m.id} value={m.id}>{m.codigo}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Descripción *</label>
              <input type="text" name="descripcion" required placeholder="Ej: Hosting, Licencia software, etc." className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="es_deducible" value="true" className="rounded" />
                Es deducible de impuestos
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-muted">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">
                {isSubmitting ? "Guardando..." : "Agregar"}
              </button>
            </div>
          </form>
        )}

        {(!project.gastos || project.gastos.length === 0) ? (
          <div className="text-center py-8">
            <IconReceipt size={48} className="mx-auto text-muted mb-4" />
            <p className="text-muted">No hay gastos registrados para este proyecto</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {project.gastos.map((gasto) => (
              <li key={gasto.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition group">
                <div>
                  <p className="font-medium text-heading">
                    {gasto.descripcion}
                    {gasto.es_deducible && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                        Deducible
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted">{new Date(gasto.fecha).toLocaleDateString("es-AR")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-red-600">
                    -{gasto.moneda?.simbolo || "$"} {parseFloat(gasto.monto).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => handleDeleteGasto(gasto.id)}
                    disabled={deleting === gasto.id}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-100 rounded transition"
                  >
                    {deleting === gasto.id ? <IconLoader2 size={16} className="animate-spin" /> : <IconTrash size={16} />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ==================== UTILS ====================

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function getImportanceColor(level) {
  const colors = {
    1: "bg-gray-400",
    2: "bg-blue-500",
    3: "bg-amber-500",
    4: "bg-orange-500",
    5: "bg-red-500",
  }
  return colors[level] || colors[3]
}

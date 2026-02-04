"use client"

import Link from "next/link"
import {
  IconUsers,
  IconBriefcase,
  IconChecklist,
  IconCash,
  IconArrowRight,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react"

export default function DashboardClient({
  stats,
  recentProjects,
  upcomingTasks,
  financialSummary,
}) {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <h1 className="text-4xl font-semibold text-heading mb-8">Dashboard</h1>

      {/* Tarjetas de estadisticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Clientes"
          value={stats.clientes.activos}
          subtitle={`${stats.clientes.total} totales`}
          icon={<IconUsers size={24} />}
          color="bg-blue-500"
          href="/clientes"
        />
        <StatCard
          title="Proyectos"
          value={stats.proyectos.enProgreso}
          subtitle={`${stats.proyectos.total} totales`}
          icon={<IconBriefcase size={24} />}
          color="bg-purple-500"
          href="/proyectos"
        />
        <StatCard
          title="Tareas Pendientes"
          value={stats.tareas.pendientes}
          subtitle={`${stats.tareas.completadas} completadas`}
          icon={<IconChecklist size={24} />}
          color="bg-amber-500"
        />
        <StatCard
          title="Balance"
          value={formatCurrency(financialSummary.balance)}
          subtitle={`${financialSummary.proyectosPendientes} pagos pendientes`}
          icon={<IconCash size={24} />}
          color="bg-emerald-500"
          isFinancial
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proyectos Recientes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading">
              Proyectos Recientes
            </h2>
            <Link
              href="/proyectos"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <IconArrowRight size={14} />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">
              No hay proyectos aun
            </p>
          ) : (
            <ul className="space-y-3">
              {recentProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <IconBriefcase size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-heading">{project.nombre}</p>
                      <p className="text-xs text-muted">
                        {project.cliente?.nombre || "Sin cliente"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      project.estado?.nombre
                    )}`}
                  >
                    {project.estado?.nombre || "Sin estado"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tareas Pendientes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading">
              Tareas Pendientes
            </h2>
          </div>

          {upcomingTasks.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">
              No hay tareas pendientes
            </p>
          ) : (
            <ul className="space-y-3">
              {upcomingTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${getPriorityColor(
                        task.importancia
                      )}`}
                    >
                      <IconClock size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-heading">{task.nombre}</p>
                      <p className="text-xs text-muted">
                        {task.proyecto?.nombre || "Sin proyecto"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted">
                    {task.importancia >= 4
                      ? "Alta"
                      : task.importancia >= 2
                      ? "Media"
                      : "Baja"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Resumen de proyectos por estado */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">
          Proyectos por Estado
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.proyectos.porEstado).map(([estado, count]) => (
            <div
              key={estado}
              className="text-center p-4 rounded-lg bg-secondary/30"
            >
              <p className="text-2xl font-bold text-heading">{count}</p>
              <p className="text-sm text-muted">{estado}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon, color, href, isFinancial }) {
  const content = (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-heading">{value}</p>
          <p className="text-xs text-subtle mt-1">{subtitle}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount)
}

function getStatusColor(status) {
  switch (status) {
    case "En Progreso":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case "Completado":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    case "Pausado":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    case "Cancelado":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

function getPriorityColor(importancia) {
  if (importancia >= 4) {
    return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
  }
  if (importancia >= 2) {
    return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
  }
  return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
}

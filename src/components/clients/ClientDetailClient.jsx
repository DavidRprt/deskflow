"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconMail,
  IconPhone,
  IconBriefcase,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconLoader2,
} from "@tabler/icons-react"
import { deleteClientAction, reactivateClientAction } from "@/actions/clientActions"

export default function ClientDetailClient({ client }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas desactivar este cliente?")) return

    setIsDeleting(true)
    try {
      const result = await deleteClientAction(client.id)
      if (result.success) {
        router.push("/clientes")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReactivate = async () => {
    setIsReactivating(true)
    try {
      const result = await reactivateClientAction(client.id)
      if (result.success) {
        router.refresh()
      }
    } finally {
      setIsReactivating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/clientes"
          className="p-2 rounded-lg hover:bg-secondary transition"
        >
          <IconArrowLeft size={20} className="text-muted" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-heading flex items-center gap-3">
            {client.nombre}
            {!client.activo && (
              <span className="text-sm font-normal px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                Inactivo
              </span>
            )}
          </h1>
          {client.tipoCliente && (
            <p className="text-muted">{client.tipoCliente.nombre}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!client.activo ? (
            <button
              onClick={handleReactivate}
              disabled={isReactivating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isReactivating ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconRefresh size={16} />
              )}
              Reactivar
            </button>
          ) : (
            <>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconTrash size={16} />
                )}
                Desactivar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Principal */}
        <div className="lg:col-span-1 space-y-6">
          {/* Datos de Contacto */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">
              Datos de Contacto
            </h2>
            <div className="space-y-4">
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconMail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Email</p>
                    <a
                      href={`mailto:${client.email}`}
                      className="text-heading hover:text-primary transition"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>
              )}
              {client.telefono && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconPhone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Telefono</p>
                    <a
                      href={`tel:${client.telefono}`}
                      className="text-heading hover:text-primary transition"
                    >
                      {client.telefono}
                    </a>
                  </div>
                </div>
              )}
              {client.fecha_alta && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconCalendar size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Cliente desde</p>
                    <p className="text-heading">
                      {new Date(client.fecha_alta).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {!client.email && !client.telefono && (
                <p className="text-muted text-sm">Sin datos de contacto</p>
              )}
            </div>
          </div>

          {/* Estadisticas */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">
              Estadisticas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {client.proyectos?.length || 0}
                </p>
                <p className="text-xs text-muted">Proyectos</p>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {client.proyectos?.filter((p) => p.estado_id === 4).length || 0}
                </p>
                <p className="text-xs text-muted">Completados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proyectos */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">Proyectos</h2>
              <Link
                href={`/proyectos/nuevo?cliente_id=${client.id}`}
                className="text-sm text-primary hover:underline"
              >
                + Nuevo proyecto
              </Link>
            </div>

            {!client.proyectos || client.proyectos.length === 0 ? (
              <div className="text-center py-12">
                <IconBriefcase size={48} className="mx-auto text-muted mb-4" />
                <p className="text-muted">Este cliente no tiene proyectos</p>
                <Link
                  href={`/proyectos/nuevo?cliente_id=${client.id}`}
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Crear primer proyecto
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {client.proyectos.map((proyecto) => (
                  <li
                    key={proyecto.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/50 transition border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <IconBriefcase size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-heading">
                          {proyecto.nombre}
                        </p>
                        {proyecto.presupuesto && (
                          <p className="text-xs text-muted">
                            Presupuesto:{" "}
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            }).format(proyecto.presupuesto)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        proyecto.estado_id
                      )}`}
                    >
                      {getStatusName(proyecto.estado_id)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(estadoId) {
  switch (estadoId) {
    case 1:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    case 2:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case 3:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    case 4:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

function getStatusName(estadoId) {
  switch (estadoId) {
    case 1:
      return "Pendiente"
    case 2:
      return "En Progreso"
    case 3:
      return "Pausado"
    case 4:
      return "Completado"
    default:
      return "Sin estado"
  }
}

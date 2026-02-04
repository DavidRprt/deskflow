"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import ClientCard from "@/components/clients/ClientCard"
import NewClientForm from "@/components/clients/NewClientForm"
import ClientsHeader from "@/components/clients/ClientsHeader"
import SearchBar from "@/components/layout/SearchBar"

export default function ClientsClient({ clients: initialClients, clientTypes }) {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [active, setActive] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [showInactive, setShowInactive] = useState(false)

  // Filtrar clientes por búsqueda, tipo y estado
  const filteredClients = useMemo(() => {
    return initialClients.filter((client) => {
      // Filtro de búsqueda
      const matchesSearch =
        !search ||
        client.nombre.toLowerCase().includes(search.toLowerCase()) ||
        client.email?.toLowerCase().includes(search.toLowerCase()) ||
        client.telefono?.includes(search)

      // Filtro por tipo de cliente
      const matchesType = !filterType || client.tipo_cliente_id === filterType

      // Filtro por estado activo/inactivo
      const matchesStatus = showInactive || client.activo

      return matchesSearch && matchesType && matchesStatus
    })
  }, [initialClients, search, filterType, showInactive])

  // Adaptar los datos del cliente para ClientCard (compatibilidad)
  const adaptClientForCard = (client) => ({
    id: client.id,
    name: client.nombre,
    projects: client.proyectosCount || 0,
    projectsActive: client.proyectosActivos || 0,
    type: client.tipoCliente?.nombre || "Sin tipo",
    email: client.email,
    phone: client.telefono,
    activo: client.activo,
    lastContact: client.fecha_alta,
    // Campos adicionales para el card
    channel: "Email",
    pendingPayments: null,
    progress: client.proyectosCount ? Math.min((client.proyectosActivos / client.proyectosCount) * 100, 100) : 0,
  })

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <ClientsHeader onAddClick={() => setShowForm(true)} />

      {showForm && (
        <NewClientForm
          onClose={() => setShowForm(false)}
          clientTypes={clientTypes}
        />
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <SearchBar value={search} setSearchText={setSearch} />
        </div>

        {/* Filtro por tipo de cliente */}
        {clientTypes && clientTypes.length > 0 && (
          <select
            value={filterType || ""}
            onChange={(e) => setFilterType(e.target.value ? parseInt(e.target.value) : null)}
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los tipos</option>
            {clientTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombre}
              </option>
            ))}
          </select>
        )}

        {/* Toggle para mostrar inactivos */}
        <label className="flex items-center gap-2 text-sm text-subtle cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          Mostrar inactivos
        </label>
      </div>

      {/* Contador de resultados */}
      <p className="text-sm text-muted mb-3">
        {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} encontrado{filteredClients.length !== 1 ? "s" : ""}
      </p>

      {/* Lista de clientes */}
      {filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted mb-2">No se encontraron clientes</p>
          <p className="text-sm text-subtle">
            {search || filterType
              ? "Prueba con otros filtros de búsqueda"
              : "Agrega tu primer cliente para comenzar"}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-280px)] overflow-y-auto">
          {filteredClients.map((client) => (
            <motion.div
              layoutId={`card-${client.nombre}`}
              key={client.id}
              onClick={() => setActive(adaptClientForCard(client))}
              className={`p-4 flex flex-col md:flex-row justify-between items-center hover:bg-secondary dark:hover:bg-secondary rounded-xl cursor-pointer transition-all ${
                !client.activo ? "opacity-60" : ""
              }`}
            >
              <div className="flex gap-4 flex-col md:flex-row items-center">
                <motion.div
                  layoutId={`image-${client.nombre}`}
                  className="h-14 w-14 rounded-full bg-primary/20 dark:bg-primary/60 flex items-center justify-center text-white text-lg font-bold"
                >
                  {client.nombre[0].toUpperCase()}
                </motion.div>
                <div>
                  <motion.h3
                    layoutId={`title-${client.nombre}`}
                    className="font-medium text-heading text-center md:text-left"
                  >
                    {client.nombre}
                    {!client.activo && (
                      <span className="ml-2 text-xs text-muted">(Inactivo)</span>
                    )}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${client.nombre}-projects`}
                    className="text-subtle text-center md:text-left"
                  >
                    {client.proyectosCount || 0} proyecto{client.proyectosCount !== 1 ? "s" : ""}
                    {client.proyectosActivos > 0 && (
                      <span className="text-primary"> ({client.proyectosActivos} activo{client.proyectosActivos !== 1 ? "s" : ""})</span>
                    )}
                  </motion.p>
                  {client.tipoCliente && (
                    <p className="text-xs text-muted mt-1">{client.tipoCliente.nombre}</p>
                  )}
                </div>
              </div>
              <motion.button
                layoutId={`button-${client.nombre}`}
                className="px-4 py-2 text-sm rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background mt-4 md:mt-0"
              >
                Detalles
              </motion.button>
            </motion.div>
          ))}
        </ul>
      )}

      <ClientCard active={active} setActive={setActive} />
    </div>
  )
}

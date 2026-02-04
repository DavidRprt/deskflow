"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconPlus,
  IconTrendingUp,
  IconTrendingDown,
  IconWallet,
  IconReceipt,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react"
import {
  createGastoAction,
  createIngresoAction,
  deleteGastoAction,
  deleteIngresoAction,
} from "@/actions/financeActions"

export default function FinancesClient({
  gastos,
  ingresos,
  monedas,
  summary,
  proyectos,
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("resumen")
  const [showGastoForm, setShowGastoForm] = useState(false)
  const [showIngresoForm, setShowIngresoForm] = useState(false)

  const formatCurrency = (amount, moneda) => {
    const simbolo = moneda?.simbolo || "$"
    return `${simbolo} ${parseFloat(amount).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    })}`
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <h1 className="text-4xl font-semibold text-heading mb-8">Finanzas</h1>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Total Ingresos"
          value={formatCurrency(summary.totalIngresos)}
          icon={<IconTrendingUp size={24} />}
          color="bg-green-500"
        />
        <SummaryCard
          title="Total Gastos"
          value={formatCurrency(summary.totalGastos)}
          icon={<IconTrendingDown size={24} />}
          color="bg-red-500"
        />
        <SummaryCard
          title="Balance"
          value={formatCurrency(summary.balance)}
          icon={<IconWallet size={24} />}
          color={summary.balance >= 0 ? "bg-blue-500" : "bg-amber-500"}
        />
        <SummaryCard
          title="Gastos Deducibles"
          value={formatCurrency(summary.gastosDeducibles)}
          icon={<IconReceipt size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-border">
        <TabButton
          active={activeTab === "resumen"}
          onClick={() => setActiveTab("resumen")}
        >
          Resumen
        </TabButton>
        <TabButton
          active={activeTab === "ingresos"}
          onClick={() => setActiveTab("ingresos")}
        >
          Ingresos ({ingresos.length})
        </TabButton>
        <TabButton
          active={activeTab === "gastos"}
          onClick={() => setActiveTab("gastos")}
        >
          Gastos ({gastos.length})
        </TabButton>
      </div>

      {/* Contenido por tab */}
      {activeTab === "resumen" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ultimos Ingresos */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">
                Ultimos Ingresos
              </h2>
              <button
                onClick={() => {
                  setActiveTab("ingresos")
                  setShowIngresoForm(true)
                }}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <IconPlus size={14} /> Nuevo
              </button>
            </div>
            {ingresos.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">
                No hay ingresos registrados
              </p>
            ) : (
              <ul className="space-y-3">
                {ingresos.slice(0, 5).map((ingreso) => (
                  <li
                    key={ingreso.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                  >
                    <div>
                      <p className="font-medium text-heading">
                        {ingreso.descripcion || "Ingreso"}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(ingreso.fecha).toLocaleDateString("es-AR")}
                        {ingreso.proyecto && ` • ${ingreso.proyecto.nombre}`}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(ingreso.monto, ingreso.moneda)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Ultimos Gastos */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">
                Ultimos Gastos
              </h2>
              <button
                onClick={() => {
                  setActiveTab("gastos")
                  setShowGastoForm(true)
                }}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <IconPlus size={14} /> Nuevo
              </button>
            </div>
            {gastos.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">
                No hay gastos registrados
              </p>
            ) : (
              <ul className="space-y-3">
                {gastos.slice(0, 5).map((gasto) => (
                  <li
                    key={gasto.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20"
                  >
                    <div>
                      <p className="font-medium text-heading">
                        {gasto.descripcion || "Gasto"}
                        {gasto.es_deducible && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                            Deducible
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(gasto.fecha).toLocaleDateString("es-AR")}
                        {gasto.proyecto && ` • ${gasto.proyecto.nombre}`}
                      </p>
                    </div>
                    <span className="font-semibold text-red-600">
                      -{formatCurrency(gasto.monto, gasto.moneda)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === "ingresos" && (
        <IngresosTab
          ingresos={ingresos}
          monedas={monedas}
          proyectos={proyectos}
          showForm={showIngresoForm}
          setShowForm={setShowIngresoForm}
          formatCurrency={formatCurrency}
          router={router}
        />
      )}

      {activeTab === "gastos" && (
        <GastosTab
          gastos={gastos}
          monedas={monedas}
          proyectos={proyectos}
          showForm={showGastoForm}
          setShowForm={setShowGastoForm}
          formatCurrency={formatCurrency}
          router={router}
        />
      )}
    </div>
  )
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-heading">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-1 text-sm font-medium transition border-b-2 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted hover:text-heading"
      }`}
    >
      {children}
    </button>
  )
}

function IngresosTab({
  ingresos,
  monedas,
  proyectos,
  showForm,
  setShowForm,
  formatCurrency,
  router,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const result = await createIngresoAction(formData)

    if (result.success) {
      setShowForm(false)
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este ingreso?")) return
    setDeleting(id)
    await deleteIngresoAction(id)
    router.refresh()
    setDeleting(null)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-heading">Ingresos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <IconPlus size={16} /> Nuevo Ingreso
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-secondary/30 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Monto *
              </label>
              <input
                type="number"
                name="monto"
                step="0.01"
                min="0.01"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Moneda *
              </label>
              <select
                name="moneda_id"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {monedas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.codigo} - {m.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Descripcion
              </label>
              <input
                type="text"
                name="descripcion"
                placeholder="Ej: Pago proyecto X"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Proyecto (opcional)
              </label>
              <select
                name="proyecto_id"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Sin proyecto</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-muted hover:text-heading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      )}

      {ingresos.length === 0 ? (
        <p className="text-muted text-center py-12">No hay ingresos registrados</p>
      ) : (
        <ul className="space-y-2">
          {ingresos.map((ingreso) => (
            <li
              key={ingreso.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition group"
            >
              <div>
                <p className="font-medium text-heading">
                  {ingreso.descripcion || "Ingreso"}
                </p>
                <p className="text-sm text-muted">
                  {new Date(ingreso.fecha).toLocaleDateString("es-AR")}
                  {ingreso.proyecto && ` • ${ingreso.proyecto.nombre}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-green-600">
                  +{formatCurrency(ingreso.monto, ingreso.moneda)}
                </span>
                <button
                  onClick={() => handleDelete(ingreso.id)}
                  disabled={deleting === ingreso.id}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-100 rounded transition"
                >
                  {deleting === ingreso.id ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : (
                    <IconTrash size={16} />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function GastosTab({
  gastos,
  monedas,
  proyectos,
  showForm,
  setShowForm,
  formatCurrency,
  router,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const result = await createGastoAction(formData)

    if (result.success) {
      setShowForm(false)
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este gasto?")) return
    setDeleting(id)
    await deleteGastoAction(id)
    router.refresh()
    setDeleting(null)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-heading">Gastos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <IconPlus size={16} /> Nuevo Gasto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-secondary/30 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Monto *
              </label>
              <input
                type="number"
                name="monto"
                step="0.01"
                min="0.01"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Moneda *
              </label>
              <select
                name="moneda_id"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {monedas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.codigo} - {m.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Descripcion
              </label>
              <input
                type="text"
                name="descripcion"
                placeholder="Ej: Licencia software"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Proyecto (opcional)
              </label>
              <select
                name="proyecto_id"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Sin proyecto</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="es_deducible"
                value="true"
                className="w-4 h-4 rounded"
              />
              Es deducible de impuestos
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-muted hover:text-heading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      )}

      {gastos.length === 0 ? (
        <p className="text-muted text-center py-12">No hay gastos registrados</p>
      ) : (
        <ul className="space-y-2">
          {gastos.map((gasto) => (
            <li
              key={gasto.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition group"
            >
              <div>
                <p className="font-medium text-heading">
                  {gasto.descripcion || "Gasto"}
                  {gasto.es_deducible && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                      Deducible
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">
                  {new Date(gasto.fecha).toLocaleDateString("es-AR")}
                  {gasto.proyecto && ` • ${gasto.proyecto.nombre}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-red-600">
                  -{formatCurrency(gasto.monto, gasto.moneda)}
                </span>
                <button
                  onClick={() => handleDelete(gasto.id)}
                  disabled={deleting === gasto.id}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-100 rounded transition"
                >
                  {deleting === gasto.id ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : (
                    <IconTrash size={16} />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

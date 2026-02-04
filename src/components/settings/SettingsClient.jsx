"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconUser,
  IconPalette,
  IconBriefcase,
  IconChartBar,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react"
import { updateProfileAction } from "@/actions/settingsActions"

export default function SettingsClient({ profile, profesiones, temas, stats }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("perfil")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)

    const formData = new FormData(e.target)
    const result = await updateProfileAction(formData)

    if (result.success) {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <h1 className="text-4xl font-semibold text-heading mb-8">Configuracion</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegacion */}
        <div className="lg:col-span-1">
          <nav className="bg-card border border-border rounded-xl p-4 space-y-1">
            <NavItem
              icon={<IconUser size={18} />}
              label="Perfil"
              active={activeTab === "perfil"}
              onClick={() => setActiveTab("perfil")}
            />
            <NavItem
              icon={<IconBriefcase size={18} />}
              label="Profesion"
              active={activeTab === "profesion"}
              onClick={() => setActiveTab("profesion")}
            />
            <NavItem
              icon={<IconPalette size={18} />}
              label="Apariencia"
              active={activeTab === "apariencia"}
              onClick={() => setActiveTab("apariencia")}
            />
            <NavItem
              icon={<IconChartBar size={18} />}
              label="Estadisticas"
              active={activeTab === "estadisticas"}
              onClick={() => setActiveTab("estadisticas")}
            />
          </nav>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            {activeTab === "perfil" && (
              <ProfileTab profile={profile} />
            )}

            {activeTab === "profesion" && (
              <ProfesionTab profile={profile} profesiones={profesiones} />
            )}

            {activeTab === "apariencia" && (
              <AparienciaTab profile={profile} temas={temas} />
            )}

            {activeTab === "estadisticas" && (
              <EstadisticasTab stats={stats} />
            )}

            {activeTab !== "estadisticas" && (
              <div className="mt-6 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <IconLoader2 size={18} className="animate-spin" />
                  ) : success ? (
                    <IconCheck size={18} />
                  ) : null}
                  {isSubmitting ? "Guardando..." : success ? "Guardado" : "Guardar cambios"}
                </button>
                {success && (
                  <span className="text-green-600 text-sm">
                    Cambios guardados correctamente
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted hover:bg-secondary hover:text-heading"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function ProfileTab({ profile }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-heading mb-6">
        Informacion Personal
      </h2>

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
            {profile.nombre?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-heading">{profile.nombre}</p>
            <p className="text-sm text-muted">
              {profile.profesion?.nombre || "Sin profesion definida"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={profile.nombre}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Idioma preferido
            </label>
            <select
              name="idioma_preferido"
              defaultValue={profile.idioma_preferido || "es"}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Portugues</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfesionTab({ profile, profesiones }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-heading mb-6">
        Profesion y Skills
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-heading mb-2">
            Tu profesion
          </label>
          <select
            name="profesion_id"
            defaultValue={profile.profesion_id || ""}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Seleccionar profesion</option>
            {profesiones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          {profile.profesion?.descripcion && (
            <p className="mt-2 text-sm text-muted">
              {profile.profesion.descripcion}
            </p>
          )}
        </div>

        <div className="p-4 bg-secondary/30 rounded-lg">
          <p className="text-sm text-muted">
            La profesion te ayuda a categorizar tus proyectos y recibir
            sugerencias personalizadas. Los skills asociados aparecen
            automaticamente segun tu profesion seleccionada.
          </p>
        </div>
      </div>
    </div>
  )
}

function AparienciaTab({ profile, temas }) {
  const [modoOscuro, setModoOscuro] = useState(profile.modo_oscuro)

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-heading mb-6">
        Apariencia
      </h2>

      <div className="space-y-6">
        {/* Modo oscuro */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <p className="font-medium text-heading">Modo oscuro</p>
            <p className="text-sm text-muted">
              Activa el tema oscuro para reducir el brillo
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="modo_oscuro"
              value="true"
              checked={modoOscuro}
              onChange={(e) => setModoOscuro(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Temas */}
        <div>
          <label className="block text-sm font-medium text-heading mb-3">
            Tema de colores
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {temas.map((tema) => (
              <label
                key={tema.id}
                className={`relative p-4 border rounded-lg cursor-pointer transition hover:border-primary ${
                  profile.tema_preferido_id === tema.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="tema_preferido_id"
                  value={tema.id}
                  defaultChecked={profile.tema_preferido_id === tema.id}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: tema.color_primario }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: tema.color_secundario }}
                  />
                </div>
                <p className="text-sm font-medium text-heading">{tema.nombre}</p>
                {tema.es_premium && (
                  <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                    Premium
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EstadisticasTab({ stats }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-heading mb-6">
        Tus Estadisticas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Clientes"
          value={stats.totalClientes}
          icon={<IconUser size={24} />}
        />
        <StatCard
          label="Total Proyectos"
          value={stats.totalProyectos}
          icon={<IconBriefcase size={24} />}
        />
        <StatCard
          label="Total Tareas"
          value={stats.totalTareas}
          icon={<IconChartBar size={24} />}
        />
      </div>

      <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
        <p className="text-sm text-muted">
          Estas estadisticas muestran un resumen de tu actividad en DeskFlow.
          Manten tu perfil actualizado para obtener mejores insights.
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="p-6 border border-border rounded-lg text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <p className="text-3xl font-bold text-heading">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}

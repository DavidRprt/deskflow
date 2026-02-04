"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconLoader2, IconLock, IconArrowLeft, IconCheck } from "@tabler/icons-react"
import { changePasswordAction } from "@/actions/authActions"

export default function CambiarContrasenaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.target)

    // Validar que las contraseñas coincidan
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      setError("Las contraseñas nuevas no coinciden")
      setIsLoading(false)
      return
    }

    const result = await changePasswordAction(formData)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/configuracion")
      }, 2000)
    } else {
      setError(result.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/configuracion"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-heading mb-4"
          >
            <IconArrowLeft size={16} />
            Volver a configuracion
          </Link>
          <h1 className="text-2xl font-bold text-heading">Cambiar contrasena</h1>
          <p className="text-muted mt-1">
            Ingresa tu contrasena actual y la nueva
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <IconCheck size={32} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-heading mb-2">
              Contrasena actualizada
            </h2>
            <p className="text-muted text-sm">
              Redirigiendo a configuracion...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Contrasena actual
              </label>
              <div className="relative">
                <IconLock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="Tu contrasena actual"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Nueva contrasena
              </label>
              <div className="relative">
                <IconLock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="password"
                  name="newPassword"
                  required
                  minLength={6}
                  placeholder="Minimo 6 caracteres"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Confirmar nueva contrasena
              </label>
              <div className="relative">
                <IconLock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  placeholder="Repetir nueva contrasena"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <IconLoader2 size={18} className="animate-spin" />}
              {isLoading ? "Actualizando..." : "Actualizar contrasena"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

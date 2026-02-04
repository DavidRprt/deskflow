"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconLoader2, IconMail, IconLock, IconUser, IconEye, IconEyeOff } from "@tabler/icons-react"
import { registerAction } from "@/actions/authActions"

export default function RegistroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)

      const password = formData.get("password")
      const confirmPassword = formData.get("confirmPassword")

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden")
        setIsLoading(false)
        return
      }

      const result = await registerAction(formData)

      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        setError(result.error || "Error al crear la cuenta")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Register error:", err)
      setError("Error inesperado. Intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <img src="/icon.png" alt="DeskFlow" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-heading">Crear cuenta</h1>
          <p className="text-muted mt-1">Registrate gratis en DeskFlow</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <IconUser
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                name="nombre"
                required
                placeholder="Tu nombre"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Email
            </label>
            <div className="relative">
              <IconMail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Contrasena
            </label>
            <div className="relative">
              <IconLock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                placeholder="Minimo 6 caracteres"
                disabled={isLoading}
                className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition"
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Confirmar contrasena
            </label>
            <div className="relative">
              <IconLock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={6}
                placeholder="Repetir contrasena"
                disabled={isLoading}
                className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition"
              >
                {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <IconLoader2 size={18} className="animate-spin" />}
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted">¿Ya tenes cuenta? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Ingresar
          </Link>
        </div>
      </div>
    </div>
  )
}

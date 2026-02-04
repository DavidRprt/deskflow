"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconLoader2, IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react"
import { loginAction } from "@/actions/authActions"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await loginAction(formData)

      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        setError(result.error || "Error al iniciar sesión")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
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
          <h1 className="text-2xl font-bold text-heading">Bienvenido</h1>
          <p className="text-muted mt-1">Ingresa a tu cuenta de DeskFlow</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Tu contrasena"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <IconLoader2 size={18} className="animate-spin" />}
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted">¿No tenes cuenta? </span>
          <Link href="/registro" className="text-primary hover:underline font-medium">
            Registrate
          </Link>
        </div>
      </div>
    </div>
  )
}

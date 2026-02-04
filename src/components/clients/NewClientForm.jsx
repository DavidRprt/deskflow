"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconX, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { createClientAction } from "@/actions/clientActions"
import { useRouter } from "next/navigation"

export default function NewClientForm({ onClose, clientTypes = [] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tipoClienteId, setTipoClienteId] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    if (tipoClienteId) {
      formData.set("tipo_cliente_id", tipoClienteId)
    }

    try {
      const result = await createClientAction(formData)

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.error || "Error al crear el cliente")
      }
    } catch (err) {
      setError("Error inesperado al crear el cliente")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-card text-foreground rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-border">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted hover:text-heading transition disabled:opacity-50"
        >
          <IconX size={20} />
        </button>

        <h2 className="text-lg font-semibold text-heading mb-4">
          Nuevo Cliente
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <span className="text-sm font-medium text-heading">
              Nombre <span className="text-destructive">*</span>
            </span>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Nombre del cliente"
              required
              disabled={isLoading}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <span className="text-sm font-medium text-heading">
              Tipo de cliente
            </span>
            <Select
              value={tipoClienteId}
              onValueChange={setTipoClienteId}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full data-[placeholder]:text-muted">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {clientTypes.length > 0 ? (
                  clientTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="1">Empresa</SelectItem>
                    <SelectItem value="2">Startup</SelectItem>
                    <SelectItem value="3">Agencia</SelectItem>
                    <SelectItem value="4">Particular</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </LabelInputContainer>

          <LabelInputContainer>
            <span className="text-sm font-medium text-heading">Email</span>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contacto@dominio.com"
              disabled={isLoading}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <span className="text-sm font-medium text-heading">Telefono</span>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="+54 11 1234-5678"
              disabled={isLoading}
            />
          </LabelInputContainer>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-heading transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <IconLoader2 size={16} className="animate-spin" />}
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function LabelInputContainer({ children, className }) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  )
}

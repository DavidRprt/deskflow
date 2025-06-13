"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export default function NewClientForm({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Cliente guardado")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-card text-foreground rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-heading transition"
        >
          <IconX size={20} />
        </button>

        <h2 className="text-lg font-semibold text-heading mb-4">
          Nuevo Cliente
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <span className="text-sm font-medium text-heading">Nombre</span>
            <Input id="name" name="name" placeholder="Cliente" required />
          </LabelInputContainer>

          <LabelInputContainer>
            <span className="text-sm font-medium text-heading">
              Tipo de cliente
            </span>
            <Select>
              <SelectTrigger className="w-full data-[placeholder]:text-muted">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empresa">Empresa</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="agencia">Agencia</SelectItem>
                <SelectItem value="consultora">Consultora</SelectItem>
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
            />
          </LabelInputContainer>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
            >
              Guardar
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

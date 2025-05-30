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
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
        >
          <IconX size={20} />
        </button>

        <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
          Nuevo Cliente
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Nombre
            </span>
            <Input id="name" name="name" placeholder="Cliente" required />
          </LabelInputContainer>

          <LabelInputContainer>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Tipo de cliente
            </span>
            <Select>
              <SelectTrigger className="w-full">
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
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </span>
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
              className="px-4 py-2 bg-indigo-700 text-white text-sm font-medium rounded-md hover:bg-indigo-600 dark:bg-indigo-300 dark:text-indigo-950 dark:hover:bg-indigo-200"
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

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AddProjectForm({ onContinue }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cliente: "",
    fechaEntrega: null,
    prioridad: "media",
    estado: "activo",
    categoriaColor: "",
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onContinue(form)
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-10"
      >
        <div className="md:col-span-2">
          <h1 className="text-2xl md:text-3xl font-bold text-heading mb-2">
            Crear nuevo proyecto
          </h1>
          <p className="text-subtle">
            Ingresá la información básica del nuevo proyecto para comenzar a
            trabajar.
          </p>
        </div>

        <Field label="Nombre del proyecto">
          <Input
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            required
            placeholder="Ej: Rediseño sitio web"
          />
        </Field>

        <Field label="Cliente o destinatario">
          <Input
            value={form.cliente}
            onChange={(e) => handleChange("cliente", e.target.value)}
            placeholder="Ej: Coca-Cola, Proyecto interno, etc."
          />
        </Field>

        <Field label="Descripción" className="md:col-span-2">
          <Textarea
            value={form.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            placeholder="Breve descripción del proyecto, objetivos, entregables..."
            rows={4}
          />
        </Field>

        <Field label="Fecha estimada de entrega">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.fechaEntrega && "text-text-muted"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.fechaEntrega
                  ? format(form.fechaEntrega, "dd/MM/yyyy")
                  : "Elegí una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.fechaEntrega}
                onSelect={(date) => {
                  handleChange("fechaEntrega", date)
                  setIsCalendarOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Importancia o prioridad">
          <Select
            value={form.prioridad}
            onValueChange={(value) => handleChange("prioridad", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elegí una prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Estado inicial">
          <Select
            value={form.estado}
            onValueChange={(value) => handleChange("estado", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elegí un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="archivado">Archivado</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Color o categoría visual">
          <Input
            value={form.categoriaColor}
            onChange={(e) => handleChange("categoriaColor", e.target.value)}
            placeholder="Ej: Marketing, Finanzas, UX..."
          />
        </Field>

        <div className="md:col-span-2 flex justify-end mt-4">
          <Button
            type="submit"
            className="w-full md:w-auto py-2 md:py-2.5 px-4 md:px-6"
          >
            Continuar
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-sm md:text-base font-medium text-heading">
        {label}
      </label>
      {children}
    </div>
  )
}

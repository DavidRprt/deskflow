"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function AddTaskForm({ proyecto }) {
  const [task, setTask] = useState({
    nombre: "",
    descripcion: "",
    fecha: null,
    peso: "",
  })

  const handleChange = (key, value) => {
    setTask((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ proyecto, tarea: task })
    // Acá iría la lógica para guardar la tarea y el proyecto completo
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Agregar primera tarea
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Asigná una tarea inicial para comenzar el seguimiento del proyecto.
      </p>

      <Field label="Nombre de la tarea">
        <Input
          value={task.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          required
          placeholder="Ej: Reunión inicial con el cliente"
        />
      </Field>

      <Field label="Descripción">
        <Textarea
          value={task.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          placeholder="Detalles, pasos clave, responsables..."
        />
      </Field>

      <Field label="Fecha estimada de finalización">
        <Calendar
          mode="single"
          selected={task.fecha}
          onSelect={(date) => handleChange("fecha", date)}
          className="rounded-md border shadow"
        />
        {task.fecha && (
          <p className="text-sm text-neutral-500 mt-1">
            Fecha seleccionada: {format(task.fecha, "dd/MM/yyyy")}
          </p>
        )}
      </Field>

      <Field label="Peso dentro del proyecto (%)">
        <Input
          type="number"
          value={task.peso}
          onChange={(e) => handleChange("peso", e.target.value)}
          placeholder="Ej: 30"
          min="1"
          max="100"
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit">Guardar tarea</Button>
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

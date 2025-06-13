"use client"

import { useState } from "react"
import AddProjectForm from "@/components/projects/AddProjectForm"
import AddTaskForm from "@/components/projects/AddTaskForm"

export default function NuevoProyectoPage() {
  const [step, setStep] = useState(1)
  const [proyecto, setProyecto] = useState(null)

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {step === 1 && (
        <AddProjectForm
          onContinue={(data) => {
            setProyecto(data)
            setStep(2)
          }}
        />
      )}
      {step === 2 && <AddTaskForm proyecto={proyecto} />}
    </div>
  )
}

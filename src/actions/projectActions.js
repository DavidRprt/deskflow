"use server"

import { revalidatePath } from "next/cache"
import {
  createProject,
  toggleArchivar,
  toggleFijar,
} from "@/services/projects/projectService"

export async function createProjectAction(formData) {
  try {
    const projectData = {
      nombre: formData.get("nombre"),
      cliente_id: parseInt(formData.get("cliente_id")),
      tipo_proyecto_id: parseInt(formData.get("tipo_proyecto_id")),
      fecha_limite: formData.get("fecha_limite") || null,
      presupuesto: formData.get("presupuesto")
        ? parseFloat(formData.get("presupuesto"))
        : null,
      persona_id: 1,
      estado_id: 1,
      gastos: 0,
      archivado: false,
      fijado: false,
      pagado: false,
      fecha_inicio: new Date().toISOString().split("T")[0],
    }

    const project = await createProject(projectData)

    revalidatePath("/proyectos")
    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function toggleArchivarAction(projectId) {
  try {
    await toggleArchivar(projectId)
    revalidatePath("/proyectos")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function toggleFijarAction(projectId) {
  try {
    await toggleFijar(projectId)
    revalidatePath("/proyectos")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

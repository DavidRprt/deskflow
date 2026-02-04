"use server"

import { revalidatePath } from "next/cache"
import {
  getProfile,
  updateProfile,
  getProfesiones,
  getSkills,
  getSkillsByProfesion,
  getTemas,
  getUserStats,
} from "@/services/settings/settingsService"

export async function getProfileAction() {
  try {
    const personaId = 1
    const profile = await getProfile(personaId)
    return { success: true, data: profile }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateProfileAction(formData) {
  try {
    const personaId = 1

    const data = {
      nombre: formData.get("nombre"),
      idioma_preferido: formData.get("idioma_preferido") || null,
      profesion_id: formData.get("profesion_id")
        ? parseInt(formData.get("profesion_id"))
        : null,
      modo_oscuro: formData.get("modo_oscuro") === "true",
      tema_preferido_id: formData.get("tema_preferido_id")
        ? parseInt(formData.get("tema_preferido_id"))
        : null,
    }

    const profile = await updateProfile(personaId, data)

    revalidatePath("/configuracion")
    revalidatePath("/")

    return { success: true, data: profile }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getProfesionesAction() {
  try {
    const profesiones = await getProfesiones()
    return { success: true, data: profesiones }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getSkillsAction() {
  try {
    const skills = await getSkills()
    return { success: true, data: skills }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getSkillsByProfesionAction(profesionId) {
  try {
    const skills = await getSkillsByProfesion(profesionId)
    return { success: true, data: skills }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getTemasAction() {
  try {
    const temas = await getTemas()
    return { success: true, data: temas }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getUserStatsAction() {
  try {
    const personaId = 1
    const stats = await getUserStats(personaId)
    return { success: true, data: stats }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

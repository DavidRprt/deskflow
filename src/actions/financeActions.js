"use server"

import { revalidatePath } from "next/cache"
import {
  getGastos,
  getIngresos,
  createGasto,
  createIngreso,
  deleteGasto,
  deleteIngreso,
  getMonedas,
  getFinancialSummary,
  getProyectosForSelect,
} from "@/services/finances/financeService"

export async function getGastosAction(options = {}) {
  try {
    const usuarioId = 1
    const gastos = await getGastos(usuarioId, options)
    return { success: true, data: gastos }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getIngresosAction(options = {}) {
  try {
    const usuarioId = 1
    const ingresos = await getIngresos(usuarioId, options)
    return { success: true, data: ingresos }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function createGastoAction(formData) {
  try {
    const usuarioId = 1

    const data = {
      monto: parseFloat(formData.get("monto")),
      fecha: formData.get("fecha"),
      descripcion: formData.get("descripcion") || null,
      es_deducible: formData.get("es_deducible") === "true",
      proyecto_id: formData.get("proyecto_id")
        ? parseInt(formData.get("proyecto_id"))
        : null,
      moneda_id: parseInt(formData.get("moneda_id")),
      usuario_id: usuarioId,
    }

    const gasto = await createGasto(data)

    revalidatePath("/finanzas")
    revalidatePath("/")

    return { success: true, data: gasto }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function createIngresoAction(formData) {
  try {
    const usuarioId = 1

    const data = {
      monto: parseFloat(formData.get("monto")),
      fecha: formData.get("fecha"),
      descripcion: formData.get("descripcion") || null,
      proyecto_id: formData.get("proyecto_id")
        ? parseInt(formData.get("proyecto_id"))
        : null,
      moneda_id: parseInt(formData.get("moneda_id")),
      usuario_id: usuarioId,
    }

    const ingreso = await createIngreso(data)

    revalidatePath("/finanzas")
    revalidatePath("/")

    return { success: true, data: ingreso }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteGastoAction(gastoId) {
  try {
    const usuarioId = 1
    await deleteGasto(gastoId, usuarioId)

    revalidatePath("/finanzas")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteIngresoAction(ingresoId) {
  try {
    const usuarioId = 1
    await deleteIngreso(ingresoId, usuarioId)

    revalidatePath("/finanzas")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getMonedasAction() {
  try {
    const monedas = await getMonedas()
    return { success: true, data: monedas }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getFinancialSummaryAction(options = {}) {
  try {
    const usuarioId = 1
    const summary = await getFinancialSummary(usuarioId, options)
    return { success: true, data: summary }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getProyectosForSelectAction() {
  try {
    const personaId = 1
    const proyectos = await getProyectosForSelect(personaId)
    return { success: true, data: proyectos }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

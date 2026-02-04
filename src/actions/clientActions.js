"use server"

import { revalidatePath } from "next/cache"
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  reactivateClient,
  getClientTypes,
  getClientStats,
} from "@/services/clients/clientService"

/**
 * Obtiene todos los clientes de la persona actual
 * @param {Object} options - Opciones de filtrado
 * @returns {Promise<Object>} Resultado con clientes o error
 */
export async function getClientsAction(options = {}) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1
    const clients = await getClients(personaId, options)
    return { success: true, data: clients }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Obtiene un cliente por su ID
 * @param {number} clientId - ID del cliente
 * @returns {Promise<Object>} Resultado con cliente o error
 */
export async function getClientAction(clientId) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1
    const client = await getClientById(clientId, personaId)

    if (!client) {
      return { success: false, error: "Cliente no encontrado" }
    }

    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Crea un nuevo cliente desde un formulario
 * @param {FormData} formData - Datos del formulario
 * @returns {Promise<Object>} Resultado con cliente creado o error
 */
export async function createClientAction(formData) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1

    const clientData = {
      nombre: formData.get("nombre"),
      email: formData.get("email") || null,
      telefono: formData.get("telefono") || null,
      tipo_cliente_id: formData.get("tipo_cliente_id")
        ? parseInt(formData.get("tipo_cliente_id"))
        : null,
      persona_id: personaId,
    }

    const client = await createClient(clientData)

    revalidatePath("/clientes")
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Crea un nuevo cliente desde un objeto de datos
 * @param {Object} data - Datos del cliente
 * @returns {Promise<Object>} Resultado con cliente creado o error
 */
export async function createClientFromDataAction(data) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1

    const clientData = {
      nombre: data.nombre,
      email: data.email || null,
      telefono: data.telefono || null,
      tipo_cliente_id: data.tipo_cliente_id || null,
      persona_id: personaId,
    }

    const client = await createClient(clientData)

    revalidatePath("/clientes")
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Actualiza un cliente existente
 * @param {number} clientId - ID del cliente
 * @param {FormData|Object} data - Datos a actualizar
 * @returns {Promise<Object>} Resultado con cliente actualizado o error
 */
export async function updateClientAction(clientId, data) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1

    // Verificar si es FormData o un objeto normal
    let updateData
    if (data instanceof FormData) {
      updateData = {
        nombre: data.get("nombre"),
        email: data.get("email") || null,
        telefono: data.get("telefono") || null,
        tipo_cliente_id: data.get("tipo_cliente_id")
          ? parseInt(data.get("tipo_cliente_id"))
          : null,
      }
    } else {
      updateData = data
    }

    const client = await updateClient(clientId, updateData, personaId)

    revalidatePath("/clientes")
    revalidatePath(`/clientes/${clientId}`)
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Elimina (desactiva) un cliente
 * @param {number} clientId - ID del cliente
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function deleteClientAction(clientId) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1

    await deleteClient(clientId, personaId)

    revalidatePath("/clientes")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Reactiva un cliente previamente eliminado
 * @param {number} clientId - ID del cliente
 * @returns {Promise<Object>} Resultado con cliente reactivado o error
 */
export async function reactivateClientAction(clientId) {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1

    const client = await reactivateClient(clientId, personaId)

    revalidatePath("/clientes")
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Obtiene los tipos de cliente disponibles
 * @returns {Promise<Object>} Resultado con tipos o error
 */
export async function getClientTypesAction() {
  try {
    const types = await getClientTypes()
    return { success: true, data: types }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Obtiene estadísticas de clientes
 * @returns {Promise<Object>} Resultado con estadísticas o error
 */
export async function getClientStatsAction() {
  try {
    // TODO: Obtener personaId de la sesión del usuario
    const personaId = 1
    const stats = await getClientStats(personaId)
    return { success: true, data: stats }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

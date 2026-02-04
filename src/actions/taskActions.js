"use server"

import { revalidatePath } from "next/cache"
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
  getTaskStates,
} from "@/services/tasks/taskService"

/**
 * Obtiene todas las tareas de un proyecto
 * @param {number} proyectoId - ID del proyecto
 * @returns {Promise<Object>} Resultado con tareas o error
 */
export async function getTasksAction(proyectoId) {
  try {
    const tasks = await getTasksByProject(proyectoId)
    return { success: true, data: tasks }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Obtiene una tarea por su ID
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Object>} Resultado con tarea o error
 */
export async function getTaskAction(taskId) {
  try {
    const task = await getTaskById(taskId)
    if (!task) {
      return { success: false, error: "Tarea no encontrada" }
    }
    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Crea una nueva tarea
 * @param {FormData|Object} data - Datos de la tarea
 * @returns {Promise<Object>} Resultado con tarea creada o error
 */
export async function createTaskAction(data) {
  try {
    let taskData

    if (data instanceof FormData) {
      taskData = {
        nombre: data.get("nombre"),
        descripcion: data.get("descripcion") || null,
        importancia: data.get("importancia")
          ? parseInt(data.get("importancia"))
          : 3,
        duracion_estimada: data.get("duracion_estimada")
          ? parseInt(data.get("duracion_estimada"))
          : null,
        estado_id: data.get("estado_id")
          ? parseInt(data.get("estado_id"))
          : 1,
        fecha_inicio: data.get("fecha_inicio") || null,
        fecha_limite: data.get("fecha_limite") || null,
        proyecto_id: parseInt(data.get("proyecto_id")),
      }
    } else {
      taskData = data
    }

    const task = await createTask(taskData)

    revalidatePath("/proyectos")
    revalidatePath(`/proyectos/${taskData.proyecto_id}`)
    revalidatePath("/")

    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Actualiza una tarea existente
 * @param {number} taskId - ID de la tarea
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Resultado con tarea actualizada o error
 */
export async function updateTaskAction(taskId, data) {
  try {
    const task = await updateTask(taskId, data)

    revalidatePath("/proyectos")
    revalidatePath(`/proyectos/${task.proyecto_id}`)
    revalidatePath("/")

    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Elimina una tarea
 * @param {number} taskId - ID de la tarea
 * @param {number} proyectoId - ID del proyecto (para revalidar)
 * @returns {Promise<Object>} Resultado de la operacion
 */
export async function deleteTaskAction(taskId, proyectoId) {
  try {
    await deleteTask(taskId)

    revalidatePath("/proyectos")
    revalidatePath(`/proyectos/${proyectoId}`)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Marca una tarea como completada
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Object>} Resultado con tarea actualizada o error
 */
export async function completeTaskAction(taskId) {
  try {
    const task = await completeTask(taskId)

    revalidatePath("/proyectos")
    revalidatePath(`/proyectos/${task.proyecto_id}`)
    revalidatePath("/")

    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Reabre una tarea completada
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Object>} Resultado con tarea actualizada o error
 */
export async function reopenTaskAction(taskId) {
  try {
    const task = await reopenTask(taskId)

    revalidatePath("/proyectos")
    revalidatePath(`/proyectos/${task.proyecto_id}`)
    revalidatePath("/")

    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Obtiene los estados disponibles para tareas
 * @returns {Promise<Object>} Resultado con estados o error
 */
export async function getTaskStatesAction() {
  try {
    const states = await getTaskStates()
    return { success: true, data: states }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

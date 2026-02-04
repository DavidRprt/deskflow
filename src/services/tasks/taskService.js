import { Tarea, Proyecto, Estado } from "@/models"
import { Op } from "sequelize"

/**
 * Obtiene todas las tareas de un proyecto
 * @param {number} proyectoId - ID del proyecto
 * @returns {Promise<Array>} Lista de tareas
 */
export async function getTasksByProject(proyectoId) {
  try {
    const tasks = await Tarea.findAll({
      where: { proyecto_id: proyectoId },
      include: [
        {
          model: Estado,
          as: "estado",
          attributes: ["id", "nombre"],
          required: false,
        },
      ],
      order: [
        ["estado_id", "ASC"],
        ["importancia", "DESC"],
        ["fecha_limite", "ASC"],
      ],
    })

    return tasks.map((t) => t.toJSON())
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

/**
 * Obtiene una tarea por su ID
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Object|null>} Tarea encontrada o null
 */
export async function getTaskById(taskId) {
  try {
    const task = await Tarea.findByPk(taskId, {
      include: [
        {
          model: Estado,
          as: "estado",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: Proyecto,
          as: "proyecto",
          attributes: ["id", "nombre", "persona_id"],
          required: false,
        },
      ],
    })

    return task ? task.toJSON() : null
  } catch (error) {
    console.error("Error fetching task:", error)
    throw new Error("Failed to fetch task")
  }
}

/**
 * Crea una nueva tarea
 * @param {Object} data - Datos de la tarea
 * @returns {Promise<Object>} Tarea creada
 */
export async function createTask(data) {
  try {
    if (!data.nombre || !data.nombre.trim()) {
      throw new Error("El nombre de la tarea es requerido")
    }
    if (!data.proyecto_id) {
      throw new Error("El proyecto_id es requerido")
    }

    const taskData = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || null,
      importancia: data.importancia || 3,
      duracion_estimada: data.duracion_estimada || null,
      estado_id: data.estado_id || 1,
      fecha_inicio: data.fecha_inicio || null,
      fecha_limite: data.fecha_limite || null,
      proyecto_id: data.proyecto_id,
    }

    const task = await Tarea.create(taskData)
    return getTaskById(task.id)
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

/**
 * Actualiza una tarea existente
 * @param {number} taskId - ID de la tarea
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Tarea actualizada
 */
export async function updateTask(taskId, data) {
  try {
    const task = await Tarea.findByPk(taskId)

    if (!task) {
      throw new Error("Tarea no encontrada")
    }

    const updateData = {}

    if (data.nombre !== undefined) {
      if (!data.nombre.trim()) {
        throw new Error("El nombre de la tarea no puede estar vacío")
      }
      updateData.nombre = data.nombre.trim()
    }
    if (data.descripcion !== undefined) {
      updateData.descripcion = data.descripcion?.trim() || null
    }
    if (data.importancia !== undefined) {
      updateData.importancia = data.importancia
    }
    if (data.duracion_estimada !== undefined) {
      updateData.duracion_estimada = data.duracion_estimada
    }
    if (data.estado_id !== undefined) {
      updateData.estado_id = data.estado_id
    }
    if (data.fecha_inicio !== undefined) {
      updateData.fecha_inicio = data.fecha_inicio
    }
    if (data.fecha_limite !== undefined) {
      updateData.fecha_limite = data.fecha_limite
    }

    await task.update(updateData)
    return getTaskById(taskId)
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

/**
 * Elimina una tarea
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<boolean>} true si se elimino correctamente
 */
export async function deleteTask(taskId) {
  try {
    const task = await Tarea.findByPk(taskId)

    if (!task) {
      throw new Error("Tarea no encontrada")
    }

    await task.destroy()
    return true
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

/**
 * Marca una tarea como completada
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Object>} Tarea actualizada
 */
export async function completeTask(taskId) {
  return updateTask(taskId, { estado_id: 4 })
}

/**
 * Reabre una tarea completada
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Object>} Tarea actualizada
 */
export async function reopenTask(taskId) {
  return updateTask(taskId, { estado_id: 2 })
}

/**
 * Obtiene los estados disponibles para tareas
 * @returns {Promise<Array>} Lista de estados
 */
export async function getTaskStates() {
  try {
    const states = await Estado.findAll({
      attributes: ["id", "nombre"],
      order: [["id", "ASC"]],
    })

    return states.map((s) => s.toJSON())
  } catch (error) {
    console.error("Error fetching task states:", error)
    throw new Error("Failed to fetch task states")
  }
}

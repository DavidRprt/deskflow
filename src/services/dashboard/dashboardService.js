import { Cliente, Proyecto, Tarea, Estado, Ingreso, Gasto } from "@/models"
import { Op } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Obtiene estadisticas generales del dashboard para una persona
 * @param {number} personaId - ID de la persona/freelancer
 * @returns {Promise<Object>} Estadisticas del dashboard
 */
export async function getDashboardStats(personaId = 1) {
  try {
    const [
      totalClientes,
      clientesActivos,
      totalProyectos,
      proyectosPorEstado,
      tareasPendientes,
      tareasCompletadas,
    ] = await Promise.all([
      // Total de clientes
      Cliente.count({ where: { persona_id: personaId } }),

      // Clientes activos
      Cliente.count({ where: { persona_id: personaId, activo: true } }),

      // Total de proyectos
      Proyecto.count({ where: { persona_id: personaId } }),

      // Proyectos por estado
      Proyecto.findAll({
        where: { persona_id: personaId },
        attributes: [
          "estado_id",
          [sequelize.fn("COUNT", sequelize.col("Proyecto.id")), "count"],
        ],
        include: [
          {
            model: Estado,
            as: "estado",
            attributes: ["nombre"],
          },
        ],
        group: ["estado_id", "estado.id"],
        raw: false,
      }),

      // Tareas pendientes (estado_id != 4, asumiendo 4 = Completado)
      Tarea.count({
        include: [
          {
            model: Proyecto,
            as: "proyecto",
            where: { persona_id: personaId },
            required: true,
          },
        ],
        where: {
          [Op.or]: [{ estado_id: { [Op.ne]: 4 } }, { estado_id: null }],
        },
      }),

      // Tareas completadas (estado_id = 4)
      Tarea.count({
        include: [
          {
            model: Proyecto,
            as: "proyecto",
            where: { persona_id: personaId },
            required: true,
          },
        ],
        where: { estado_id: 4 },
      }),
    ])

    // Procesar proyectos por estado
    const estadosMap = {}
    proyectosPorEstado.forEach((item) => {
      const nombreEstado = item.estado?.nombre || "Sin estado"
      estadosMap[nombreEstado] = parseInt(item.dataValues.count)
    })

    return {
      clientes: {
        total: totalClientes,
        activos: clientesActivos,
      },
      proyectos: {
        total: totalProyectos,
        porEstado: estadosMap,
        enProgreso: estadosMap["En Progreso"] || 0,
        completados: estadosMap["Completado"] || 0,
      },
      tareas: {
        pendientes: tareasPendientes,
        completadas: tareasCompletadas,
        total: tareasPendientes + tareasCompletadas,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard stats")
  }
}

/**
 * Obtiene los proyectos recientes
 * @param {number} personaId - ID de la persona/freelancer
 * @param {number} limit - Cantidad de proyectos a retornar
 * @returns {Promise<Array>} Proyectos recientes
 */
export async function getRecentProjects(personaId = 1, limit = 5) {
  try {
    const projects = await Proyecto.findAll({
      where: { persona_id: personaId, archivado: false },
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nombre"],
        },
        {
          model: Estado,
          as: "estado",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["fecha_inicio", "DESC"]],
      limit,
    })

    return projects.map((p) => p.toJSON())
  } catch (error) {
    console.error("Error fetching recent projects:", error)
    throw new Error("Failed to fetch recent projects")
  }
}

/**
 * Obtiene las tareas pendientes mas proximas
 * @param {number} personaId - ID de la persona/freelancer
 * @param {number} limit - Cantidad de tareas a retornar
 * @returns {Promise<Array>} Tareas pendientes
 */
export async function getUpcomingTasks(personaId = 1, limit = 5) {
  try {
    const tasks = await Tarea.findAll({
      where: {
        [Op.or]: [{ estado_id: { [Op.ne]: 4 } }, { estado_id: null }],
      },
      include: [
        {
          model: Proyecto,
          as: "proyecto",
          where: { persona_id: personaId },
          required: true,
          attributes: ["id", "nombre"],
        },
      ],
      order: [
        ["importancia", "DESC"],
        ["fecha_limite", "ASC"],
      ],
      limit,
    })

    return tasks.map((t) => t.toJSON())
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error)
    throw new Error("Failed to fetch upcoming tasks")
  }
}

/**
 * Obtiene resumen financiero
 * @param {number} personaId - ID de la persona/freelancer
 * @returns {Promise<Object>} Resumen financiero
 */
export async function getFinancialSummary(personaId = 1) {
  try {
    // Obtener suma de presupuestos de proyectos
    const presupuestoTotal = await Proyecto.sum("presupuesto", {
      where: { persona_id: personaId },
    })

    // Obtener suma de gastos de proyectos
    const gastosTotal = await Proyecto.sum("gastos", {
      where: { persona_id: personaId },
    })

    // Proyectos pagados vs pendientes
    const [pagados, pendientes] = await Promise.all([
      Proyecto.count({ where: { persona_id: personaId, pagado: true } }),
      Proyecto.count({ where: { persona_id: personaId, pagado: false } }),
    ])

    return {
      presupuestoTotal: presupuestoTotal || 0,
      gastosTotal: gastosTotal || 0,
      balance: (presupuestoTotal || 0) - (gastosTotal || 0),
      proyectosPagados: pagados,
      proyectosPendientes: pendientes,
    }
  } catch (error) {
    console.error("Error fetching financial summary:", error)
    throw new Error("Failed to fetch financial summary")
  }
}

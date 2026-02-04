import { Gasto, Ingreso, Moneda, Proyecto, Usuario } from "@/models"
import { Op } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Obtiene todos los gastos de un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {Object} options - Opciones de filtrado
 * @returns {Promise<Array>} Lista de gastos
 */
export async function getGastos(usuarioId = 1, options = {}) {
  try {
    const { proyectoId, fechaDesde, fechaHasta, esDeducible } = options

    const where = { usuario_id: usuarioId }

    if (proyectoId) {
      where.proyecto_id = proyectoId
    }
    if (fechaDesde) {
      where.fecha = { ...where.fecha, [Op.gte]: fechaDesde }
    }
    if (fechaHasta) {
      where.fecha = { ...where.fecha, [Op.lte]: fechaHasta }
    }
    if (typeof esDeducible === "boolean") {
      where.es_deducible = esDeducible
    }

    const gastos = await Gasto.findAll({
      where,
      include: [
        {
          model: Proyecto,
          as: "proyecto",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: Moneda,
          as: "moneda",
          attributes: ["id", "codigo", "nombre", "simbolo"],
          required: false,
        },
      ],
      order: [["fecha", "DESC"]],
    })

    return gastos.map((g) => g.toJSON())
  } catch (error) {
    console.error("Error fetching gastos:", error)
    throw new Error("Failed to fetch gastos")
  }
}

/**
 * Obtiene todos los ingresos de un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {Object} options - Opciones de filtrado
 * @returns {Promise<Array>} Lista de ingresos
 */
export async function getIngresos(usuarioId = 1, options = {}) {
  try {
    const { proyectoId, fechaDesde, fechaHasta } = options

    const where = { usuario_id: usuarioId }

    if (proyectoId) {
      where.proyecto_id = proyectoId
    }
    if (fechaDesde) {
      where.fecha = { ...where.fecha, [Op.gte]: fechaDesde }
    }
    if (fechaHasta) {
      where.fecha = { ...where.fecha, [Op.lte]: fechaHasta }
    }

    const ingresos = await Ingreso.findAll({
      where,
      include: [
        {
          model: Proyecto,
          as: "proyecto",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: Moneda,
          as: "moneda",
          attributes: ["id", "codigo", "nombre", "simbolo"],
          required: false,
        },
      ],
      order: [["fecha", "DESC"]],
    })

    return ingresos.map((i) => i.toJSON())
  } catch (error) {
    console.error("Error fetching ingresos:", error)
    throw new Error("Failed to fetch ingresos")
  }
}

/**
 * Crea un nuevo gasto
 * @param {Object} data - Datos del gasto
 * @returns {Promise<Object>} Gasto creado
 */
export async function createGasto(data) {
  try {
    if (!data.monto || data.monto <= 0) {
      throw new Error("El monto debe ser mayor a 0")
    }
    if (!data.fecha) {
      throw new Error("La fecha es requerida")
    }
    if (!data.moneda_id) {
      throw new Error("La moneda es requerida")
    }

    const gastoData = {
      monto: data.monto,
      fecha: data.fecha,
      descripcion: data.descripcion?.trim() || null,
      es_deducible: data.es_deducible || false,
      usuario_id: data.usuario_id,
      proyecto_id: data.proyecto_id || null,
      moneda_id: data.moneda_id,
    }

    const gasto = await Gasto.create(gastoData)

    return gasto.toJSON()
  } catch (error) {
    console.error("Error creating gasto:", error)
    throw error
  }
}

/**
 * Crea un nuevo ingreso
 * @param {Object} data - Datos del ingreso
 * @returns {Promise<Object>} Ingreso creado
 */
export async function createIngreso(data) {
  try {
    if (!data.monto || data.monto <= 0) {
      throw new Error("El monto debe ser mayor a 0")
    }
    if (!data.fecha) {
      throw new Error("La fecha es requerida")
    }
    if (!data.moneda_id) {
      throw new Error("La moneda es requerida")
    }

    const ingresoData = {
      monto: data.monto,
      fecha: data.fecha,
      descripcion: data.descripcion?.trim() || null,
      usuario_id: data.usuario_id,
      proyecto_id: data.proyecto_id || null,
      moneda_id: data.moneda_id,
    }

    const ingreso = await Ingreso.create(ingresoData)

    return ingreso.toJSON()
  } catch (error) {
    console.error("Error creating ingreso:", error)
    throw error
  }
}

/**
 * Elimina un gasto
 * @param {number} gastoId - ID del gasto
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<boolean>}
 */
export async function deleteGasto(gastoId, usuarioId = 1) {
  try {
    const gasto = await Gasto.findOne({
      where: { id: gastoId, usuario_id: usuarioId },
    })

    if (!gasto) {
      throw new Error("Gasto no encontrado")
    }

    await gasto.destroy()
    return true
  } catch (error) {
    console.error("Error deleting gasto:", error)
    throw error
  }
}

/**
 * Elimina un ingreso
 * @param {number} ingresoId - ID del ingreso
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<boolean>}
 */
export async function deleteIngreso(ingresoId, usuarioId = 1) {
  try {
    const ingreso = await Ingreso.findOne({
      where: { id: ingresoId, usuario_id: usuarioId },
    })

    if (!ingreso) {
      throw new Error("Ingreso no encontrado")
    }

    await ingreso.destroy()
    return true
  } catch (error) {
    console.error("Error deleting ingreso:", error)
    throw error
  }
}

/**
 * Obtiene las monedas disponibles
 * @returns {Promise<Array>} Lista de monedas
 */
export async function getMonedas() {
  try {
    const monedas = await Moneda.findAll({
      attributes: ["id", "codigo", "nombre", "simbolo"],
      order: [["codigo", "ASC"]],
    })

    return monedas.map((m) => m.toJSON())
  } catch (error) {
    console.error("Error fetching monedas:", error)
    throw new Error("Failed to fetch monedas")
  }
}

/**
 * Obtiene resumen financiero
 * @param {number} usuarioId - ID del usuario
 * @param {Object} options - Opciones de filtrado (mes, año)
 * @returns {Promise<Object>} Resumen financiero
 */
export async function getFinancialSummary(usuarioId = 1, options = {}) {
  try {
    const { mes, anio } = options
    const where = { usuario_id: usuarioId }

    // Filtrar por mes/año si se especifica
    if (mes && anio) {
      const fechaInicio = new Date(anio, mes - 1, 1)
      const fechaFin = new Date(anio, mes, 0)
      where.fecha = {
        [Op.gte]: fechaInicio.toISOString().split("T")[0],
        [Op.lte]: fechaFin.toISOString().split("T")[0],
      }
    } else if (anio) {
      where.fecha = {
        [Op.gte]: `${anio}-01-01`,
        [Op.lte]: `${anio}-12-31`,
      }
    }

    const [totalGastos, totalIngresos, gastosDeducibles] = await Promise.all([
      Gasto.sum("monto", { where }),
      Ingreso.sum("monto", { where }),
      Gasto.sum("monto", { where: { ...where, es_deducible: true } }),
    ])

    return {
      totalGastos: parseFloat(totalGastos) || 0,
      totalIngresos: parseFloat(totalIngresos) || 0,
      balance: (parseFloat(totalIngresos) || 0) - (parseFloat(totalGastos) || 0),
      gastosDeducibles: parseFloat(gastosDeducibles) || 0,
    }
  } catch (error) {
    console.error("Error fetching financial summary:", error)
    throw new Error("Failed to fetch financial summary")
  }
}

/**
 * Obtiene proyectos para selector
 * @param {number} personaId - ID de la persona
 * @returns {Promise<Array>} Lista de proyectos
 */
export async function getProyectosForSelect(personaId = 1) {
  try {
    const proyectos = await Proyecto.findAll({
      where: { persona_id: personaId },
      attributes: ["id", "nombre"],
      order: [["nombre", "ASC"]],
    })

    return proyectos.map((p) => p.toJSON())
  } catch (error) {
    console.error("Error fetching proyectos:", error)
    throw new Error("Failed to fetch proyectos")
  }
}

import { Cliente, TipoCliente, Proyecto } from "@/models"
import { Op } from "sequelize"

/**
 * Obtiene todos los clientes de una persona (freelancer)
 * @param {number} personaId - ID de la persona/freelancer
 * @param {Object} options - Opciones de filtrado
 * @param {string} options.search - Término de búsqueda (nombre, email, teléfono)
 * @param {number} options.tipoClienteId - Filtrar por tipo de cliente
 * @param {boolean} options.activo - Filtrar por estado activo/inactivo
 * @param {boolean} options.includeProjects - Incluir conteo de proyectos
 * @returns {Promise<Array>} Lista de clientes
 */
export async function getClients(personaId = 1, options = {}) {
  try {
    const { search, tipoClienteId, activo, includeProjects = true } = options

    // Construir condiciones de búsqueda
    const where = { persona_id: personaId }

    // Filtro de búsqueda por texto
    if (search && search.trim()) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search.trim()}%` } },
        { email: { [Op.iLike]: `%${search.trim()}%` } },
        { telefono: { [Op.iLike]: `%${search.trim()}%` } },
      ]
    }

    // Filtro por tipo de cliente
    if (tipoClienteId) {
      where.tipo_cliente_id = tipoClienteId
    }

    // Filtro por estado activo
    if (typeof activo === "boolean") {
      where.activo = activo
    }

    // Configurar includes
    const include = [
      {
        model: TipoCliente,
        as: "tipoCliente",
        attributes: ["id", "nombre"],
        required: false,
      },
    ]

    // Incluir proyectos para conteo si se solicita
    if (includeProjects) {
      include.push({
        model: Proyecto,
        as: "proyectos",
        attributes: ["id", "nombre", "estado_id"],
        required: false,
      })
    }

    const clients = await Cliente.findAll({
      where,
      include,
      order: [
        ["activo", "DESC"],
        ["nombre", "ASC"],
      ],
    })

    return clients.map((c) => {
      const json = c.toJSON()
      // Agregar conteo de proyectos si se incluyeron
      if (includeProjects && json.proyectos) {
        json.proyectosCount = json.proyectos.length
        json.proyectosActivos = json.proyectos.filter(
          (p) => p.estado_id !== 4 // Asumiendo que estado_id 4 es "Completado"
        ).length
      }
      return json
    })
  } catch (error) {
    console.error("Error fetching clients:", error)
    throw new Error("Failed to fetch clients")
  }
}

/**
 * Obtiene un cliente por su ID
 * @param {number} clientId - ID del cliente
 * @param {number} personaId - ID de la persona (para verificar propiedad)
 * @returns {Promise<Object|null>} Cliente encontrado o null
 */
export async function getClientById(clientId, personaId = 1) {
  try {
    const client = await Cliente.findOne({
      where: {
        id: clientId,
        persona_id: personaId,
      },
      include: [
        {
          model: TipoCliente,
          as: "tipoCliente",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: Proyecto,
          as: "proyectos",
          attributes: ["id", "nombre", "estado_id", "presupuesto", "fecha_inicio"],
          required: false,
        },
      ],
    })

    if (!client) {
      return null
    }

    return client.toJSON()
  } catch (error) {
    console.error("Error fetching client:", error)
    throw new Error("Failed to fetch client")
  }
}

/**
 * Crea un nuevo cliente
 * @param {Object} data - Datos del cliente
 * @param {string} data.nombre - Nombre del cliente (requerido)
 * @param {string} data.email - Email del cliente
 * @param {string} data.telefono - Teléfono del cliente
 * @param {number} data.tipo_cliente_id - ID del tipo de cliente
 * @param {number} data.persona_id - ID de la persona/freelancer (requerido)
 * @returns {Promise<Object>} Cliente creado
 */
export async function createClient(data) {
  try {
    // Validar campos requeridos
    if (!data.nombre || !data.nombre.trim()) {
      throw new Error("El nombre del cliente es requerido")
    }
    if (!data.persona_id) {
      throw new Error("El persona_id es requerido")
    }

    const clientData = {
      nombre: data.nombre.trim(),
      email: data.email?.trim() || null,
      telefono: data.telefono?.trim() || null,
      tipo_cliente_id: data.tipo_cliente_id || null,
      persona_id: data.persona_id,
      activo: true,
      fecha_alta: new Date(),
    }

    const client = await Cliente.create(clientData)

    // Retornar con relaciones incluidas
    return getClientById(client.id, data.persona_id)
  } catch (error) {
    console.error("Error creating client:", error)
    throw error
  }
}

/**
 * Actualiza un cliente existente
 * @param {number} clientId - ID del cliente a actualizar
 * @param {Object} data - Datos a actualizar
 * @param {number} personaId - ID de la persona (para verificar propiedad)
 * @returns {Promise<Object>} Cliente actualizado
 */
export async function updateClient(clientId, data, personaId = 1) {
  try {
    const client = await Cliente.findOne({
      where: {
        id: clientId,
        persona_id: personaId,
      },
    })

    if (!client) {
      throw new Error("Cliente no encontrado")
    }

    // Preparar datos para actualizar
    const updateData = {}

    if (data.nombre !== undefined) {
      if (!data.nombre.trim()) {
        throw new Error("El nombre del cliente no puede estar vacío")
      }
      updateData.nombre = data.nombre.trim()
    }
    if (data.email !== undefined) {
      updateData.email = data.email?.trim() || null
    }
    if (data.telefono !== undefined) {
      updateData.telefono = data.telefono?.trim() || null
    }
    if (data.tipo_cliente_id !== undefined) {
      updateData.tipo_cliente_id = data.tipo_cliente_id || null
    }
    if (data.activo !== undefined) {
      updateData.activo = data.activo
    }

    await client.update(updateData)

    // Retornar con relaciones incluidas
    return getClientById(clientId, personaId)
  } catch (error) {
    console.error("Error updating client:", error)
    throw error
  }
}

/**
 * Elimina un cliente (soft delete - marca como inactivo)
 * @param {number} clientId - ID del cliente
 * @param {number} personaId - ID de la persona (para verificar propiedad)
 * @returns {Promise<Object>} Cliente desactivado
 */
export async function deleteClient(clientId, personaId = 1) {
  try {
    const client = await Cliente.findOne({
      where: {
        id: clientId,
        persona_id: personaId,
      },
    })

    if (!client) {
      throw new Error("Cliente no encontrado")
    }

    // Soft delete: marcar como inactivo
    await client.update({ activo: false })

    return client.toJSON()
  } catch (error) {
    console.error("Error deleting client:", error)
    throw error
  }
}

/**
 * Reactiva un cliente previamente eliminado
 * @param {number} clientId - ID del cliente
 * @param {number} personaId - ID de la persona (para verificar propiedad)
 * @returns {Promise<Object>} Cliente reactivado
 */
export async function reactivateClient(clientId, personaId = 1) {
  try {
    const client = await Cliente.findOne({
      where: {
        id: clientId,
        persona_id: personaId,
      },
    })

    if (!client) {
      throw new Error("Cliente no encontrado")
    }

    await client.update({ activo: true })

    return getClientById(clientId, personaId)
  } catch (error) {
    console.error("Error reactivating client:", error)
    throw error
  }
}

/**
 * Obtiene todos los tipos de cliente disponibles
 * @returns {Promise<Array>} Lista de tipos de cliente
 */
export async function getClientTypes() {
  try {
    const types = await TipoCliente.findAll({
      attributes: ["id", "nombre", "descripcion"],
      order: [["nombre", "ASC"]],
    })

    return types.map((t) => t.toJSON())
  } catch (error) {
    console.error("Error fetching client types:", error)
    throw new Error("Failed to fetch client types")
  }
}

/**
 * Obtiene estadísticas de clientes para una persona
 * @param {number} personaId - ID de la persona/freelancer
 * @returns {Promise<Object>} Estadísticas de clientes
 */
export async function getClientStats(personaId = 1) {
  try {
    const [total, activos, conProyectos] = await Promise.all([
      // Total de clientes
      Cliente.count({ where: { persona_id: personaId } }),
      // Clientes activos
      Cliente.count({ where: { persona_id: personaId, activo: true } }),
      // Clientes con al menos un proyecto
      Cliente.count({
        where: { persona_id: personaId, activo: true },
        include: [
          {
            model: Proyecto,
            as: "proyectos",
            required: true,
          },
        ],
        distinct: true,
      }),
    ])

    return {
      total,
      activos,
      inactivos: total - activos,
      conProyectos,
      sinProyectos: activos - conProyectos,
    }
  } catch (error) {
    console.error("Error fetching client stats:", error)
    throw new Error("Failed to fetch client stats")
  }
}

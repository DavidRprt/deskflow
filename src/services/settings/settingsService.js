import { Persona, Usuario, Profesion, Skill, TemaVisual, ProfesionSkill } from "@/models"

/**
 * Obtiene el perfil completo de una persona
 * @param {number} personaId - ID de la persona
 * @returns {Promise<Object>} Perfil de la persona
 */
export async function getProfile(personaId = 1) {
  try {
    const persona = await Persona.findByPk(personaId, {
      include: [
        {
          model: Profesion,
          as: "profesion",
          attributes: ["id", "nombre", "descripcion"],
          required: false,
        },
        {
          model: TemaVisual,
          as: "temaPreferido",
          attributes: ["id", "nombre", "color_primario", "color_secundario"],
          required: false,
        },
      ],
    })

    if (!persona) {
      throw new Error("Persona no encontrada")
    }

    return persona.toJSON()
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

/**
 * Actualiza el perfil de una persona
 * @param {number} personaId - ID de la persona
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Perfil actualizado
 */
export async function updateProfile(personaId = 1, data) {
  try {
    const persona = await Persona.findByPk(personaId)

    if (!persona) {
      throw new Error("Persona no encontrada")
    }

    const updateData = {}

    if (data.nombre !== undefined) {
      if (!data.nombre.trim()) {
        throw new Error("El nombre no puede estar vacío")
      }
      updateData.nombre = data.nombre.trim()
    }
    if (data.avatar !== undefined) updateData.avatar = data.avatar
    if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = data.fecha_nacimiento
    if (data.idioma_preferido !== undefined) updateData.idioma_preferido = data.idioma_preferido
    if (data.tema_preferido_id !== undefined) updateData.tema_preferido_id = data.tema_preferido_id
    if (data.modo_oscuro !== undefined) updateData.modo_oscuro = data.modo_oscuro
    if (data.profesion_id !== undefined) updateData.profesion_id = data.profesion_id

    await persona.update(updateData)

    return getProfile(personaId)
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

/**
 * Obtiene todas las profesiones disponibles
 * @returns {Promise<Array>} Lista de profesiones
 */
export async function getProfesiones() {
  try {
    const profesiones = await Profesion.findAll({
      attributes: ["id", "nombre", "descripcion"],
      order: [["nombre", "ASC"]],
    })

    return profesiones.map((p) => p.toJSON())
  } catch (error) {
    console.error("Error fetching profesiones:", error)
    throw new Error("Failed to fetch profesiones")
  }
}

/**
 * Obtiene todos los skills disponibles
 * @returns {Promise<Array>} Lista de skills
 */
export async function getSkills() {
  try {
    const skills = await Skill.findAll({
      attributes: ["id", "nombre"],
      order: [["nombre", "ASC"]],
    })

    return skills.map((s) => s.toJSON())
  } catch (error) {
    console.error("Error fetching skills:", error)
    throw new Error("Failed to fetch skills")
  }
}

/**
 * Obtiene los skills de una profesión
 * @param {number} profesionId - ID de la profesión
 * @returns {Promise<Array>} Lista de skills
 */
export async function getSkillsByProfesion(profesionId) {
  try {
    const profesion = await Profesion.findByPk(profesionId, {
      include: [
        {
          model: Skill,
          as: "skills",
          attributes: ["id", "nombre"],
          through: { attributes: [] },
        },
      ],
    })

    if (!profesion) {
      return []
    }

    return profesion.skills.map((s) => s.toJSON())
  } catch (error) {
    console.error("Error fetching skills by profesion:", error)
    throw new Error("Failed to fetch skills")
  }
}

/**
 * Obtiene todos los temas visuales disponibles
 * @returns {Promise<Array>} Lista de temas
 */
export async function getTemas() {
  try {
    const temas = await TemaVisual.findAll({
      attributes: ["id", "nombre", "color_primario", "color_secundario", "precio"],
      order: [["nombre", "ASC"]],
    })

    // Mapear precio a es_premium para la UI
    return temas.map((t) => {
      const json = t.toJSON()
      json.es_premium = json.precio && parseFloat(json.precio) > 0
      return json
    })
  } catch (error) {
    console.error("Error fetching temas:", error)
    throw new Error("Failed to fetch temas")
  }
}

/**
 * Obtiene estadísticas del usuario
 * @param {number} personaId - ID de la persona
 * @returns {Promise<Object>} Estadísticas
 */
export async function getUserStats(personaId = 1) {
  try {
    const { Cliente, Proyecto, Tarea } = await import("@/models")

    const [totalClientes, totalProyectos, totalTareas] = await Promise.all([
      Cliente.count({ where: { persona_id: personaId } }),
      Proyecto.count({ where: { persona_id: personaId } }),
      Tarea.count({
        include: [
          {
            model: Proyecto,
            as: "proyecto",
            where: { persona_id: personaId },
            required: true,
          },
        ],
      }),
    ])

    return {
      totalClientes,
      totalProyectos,
      totalTareas,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw new Error("Failed to fetch user stats")
  }
}

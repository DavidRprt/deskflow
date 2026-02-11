import { Proyecto, Cliente, TipoProyecto, Estado, Tarea, Gasto, Moneda } from "@/models"

export async function getProjects(personaId = 1) {
  try {
    const projects = await Proyecto.findAll({
      where: { persona_id: personaId },
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: TipoProyecto,
          as: "tipoProyecto",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: Estado,
          as: "estado",
          attributes: ["id", "nombre", "color"],
          required: false,
        },
        {
          model: Tarea,
          as: "tareas",
          attributes: [
            "id",
            "nombre",
            "importancia",
            "estado_id",
            "fecha_limite",
          ],
          required: false,
        },
      ],
      order: [
        ["fijado", "DESC"],
        ["fecha_inicio", "DESC"],
      ],
    })

    return projects.map((p) => p.toJSON())
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function getClientes(personaId = 1) {
  try {
    const clientes = await Cliente.findAll({
      where: { persona_id: personaId, activo: true },
      attributes: ["id", "nombre"],
      order: [["nombre", "ASC"]],
    })

    return clientes.map((c) => c.toJSON())
  } catch (error) {
    console.error("Error fetching clients:", error)
    throw new Error("Failed to fetch clients")
  }
}

export async function getTiposProyecto() {
  try {
    const tipos = await TipoProyecto.findAll({
      where: { activo: true },
      attributes: ["id", "nombre"],
      order: [["nombre", "ASC"]],
    })

    return tipos.map((t) => t.toJSON())
  } catch (error) {
    console.error("Error fetching project types:", error)
    throw new Error("Failed to fetch project types")
  }
}

export async function toggleArchivar(projectId) {
  try {
    const project = await Proyecto.findByPk(projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    await project.update({ archivado: !project.archivado })
    return project.toJSON()
  } catch (error) {
    console.error("Error toggling archive:", error)
    throw new Error("Failed to toggle archive")
  }
}

export async function toggleFijar(projectId) {
  try {
    const project = await Proyecto.findByPk(projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    await project.update({ fijado: !project.fijado })
    return project.toJSON()
  } catch (error) {
    console.error("Error toggling pin:", error)
    throw new Error("Failed to toggle pin")
  }
}

export async function createProject(data) {
  try {
    const project = await Proyecto.create(data)
    return project.toJSON()
  } catch (error) {
    console.error("Error creating project:", error)
    throw new Error("Failed to create project")
  }
}

export async function getProjectById(projectId, personaId = 1) {
  try {
    const project = await Proyecto.findOne({
      where: { id: projectId, persona_id: personaId },
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nombre", "email"],
          required: false,
        },
        {
          model: TipoProyecto,
          as: "tipoProyecto",
          attributes: ["id", "nombre"],
          required: false,
        },
        {
          model: Estado,
          as: "estado",
          attributes: ["id", "nombre", "color"],
          required: false,
        },
        {
          model: Tarea,
          as: "tareas",
          attributes: [
            "id",
            "nombre",
            "descripcion",
            "importancia",
            "estado_id",
            "fecha_inicio",
            "fecha_limite",
            "duracion_estimada",
          ],
          required: false,
          include: [
            {
              model: Estado,
              as: "estado",
              attributes: ["id", "nombre"],
              required: false,
            },
          ],
        },
        {
          model: Gasto,
          as: "registrosGastos",
          attributes: ["id", "monto", "fecha", "descripcion", "es_deducible", "moneda_id"],
          required: false,
          include: [
            {
              model: Moneda,
              as: "moneda",
              attributes: ["id", "codigo", "nombre", "simbolo"],
              required: false,
            },
          ],
        },
      ],
    })

    if (!project) return null

    // Transformar el resultado para usar "gastos" en lugar de "registrosGastos"
    const json = project.toJSON()
    json.gastos = json.registrosGastos || []
    delete json.registrosGastos

    return json
  } catch (error) {
    console.error("Error fetching project:", error)
    throw new Error("Failed to fetch project")
  }
}

export async function updateProject(projectId, data, personaId = 1) {
  try {
    const project = await Proyecto.findOne({
      where: { id: projectId, persona_id: personaId },
    })

    if (!project) {
      throw new Error("Proyecto no encontrado")
    }

    const updateData = {}

    if (data.nombre !== undefined) updateData.nombre = data.nombre
    if (data.cliente_id !== undefined) updateData.cliente_id = data.cliente_id
    if (data.tipo_proyecto_id !== undefined) updateData.tipo_proyecto_id = data.tipo_proyecto_id
    if (data.estado_id !== undefined) updateData.estado_id = data.estado_id
    if (data.presupuesto !== undefined) updateData.presupuesto = data.presupuesto
    if (data.gastos !== undefined) updateData.gastos = data.gastos
    if (data.fecha_inicio !== undefined) updateData.fecha_inicio = data.fecha_inicio
    if (data.fecha_limite !== undefined) updateData.fecha_limite = data.fecha_limite
    if (data.archivado !== undefined) updateData.archivado = data.archivado
    if (data.fijado !== undefined) updateData.fijado = data.fijado
    if (data.pagado !== undefined) updateData.pagado = data.pagado

    await project.update(updateData)
    return getProjectById(projectId, personaId)
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export async function deleteProject(projectId, personaId = 1) {
  try {
    const project = await Proyecto.findOne({
      where: { id: projectId, persona_id: personaId },
    })

    if (!project) {
      throw new Error("Proyecto no encontrado")
    }

    // Primero eliminar tareas asociadas
    await Tarea.destroy({ where: { proyecto_id: projectId } })

    // Luego eliminar el proyecto
    await project.destroy()
    return true
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

export async function getEstados() {
  try {
    const estados = await Estado.findAll({
      attributes: ["id", "nombre", "color"],
      order: [["id", "ASC"]],
    })

    return estados.map((e) => e.toJSON())
  } catch (error) {
    console.error("Error fetching states:", error)
    throw new Error("Failed to fetch states")
  }
}

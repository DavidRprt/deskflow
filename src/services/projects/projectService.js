import { Proyecto, Cliente, TipoProyecto, Estado, Tarea } from "@/models"

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

import {
  getProjects,
  getClientes,
  getTiposProyecto,
} from "@/services/projects/projectService"
import ProjectsClient from "@/components/projects/ProjectsClient"

export default async function ProjectsPage() {
  const [projects, clientes, tiposProyecto] = await Promise.all([
    getProjects(),
    getClientes(),
    getTiposProyecto(),
  ])

  return (
    <ProjectsClient
      projects={projects}
      clientes={clientes}
      tiposProyecto={tiposProyecto}
    />
  )
}

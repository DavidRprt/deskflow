import { getProjectById, getEstados } from "@/services/projects/projectService"
import { getMonedas } from "@/services/finances/financeService"
import { notFound } from "next/navigation"
import ProjectDetailClient from "@/components/projects/ProjectDetailClient"

export default async function ProjectDetailPage({ params }) {
  const { id } = await params
  const [project, estados, monedas] = await Promise.all([
    getProjectById(parseInt(id), 1),
    getEstados(),
    getMonedas(),
  ])

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} estados={estados} monedas={monedas} />
}

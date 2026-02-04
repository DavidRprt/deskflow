import { getProjectById, getEstados } from "@/services/projects/projectService"
import { notFound } from "next/navigation"
import ProjectDetailClient from "@/components/projects/ProjectDetailClient"

export default async function ProjectDetailPage({ params }) {
  const { id } = await params
  const [project, estados] = await Promise.all([
    getProjectById(parseInt(id), 1),
    getEstados(),
  ])

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} estados={estados} />
}

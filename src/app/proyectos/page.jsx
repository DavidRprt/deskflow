"use client"

import { useState } from "react"
import { projects as rawProjects } from "@/data/projects"
import ProjectCard from "@/components/projects/ProjectCard"
import SearchBar from "@/components/layout/SearchBar"
import ProjectTimingFilter from "@/components/projects/ProjectTimingFilter"
import { HiFolderAdd } from "react-icons/hi"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"


function calculateProgress(tasks) {
  const total = tasks.reduce((acc, t) => acc + t.importance, 0)
  const completed = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.importance, 0)
  return total === 0 ? 0 : Math.round((completed / total) * 100)
}

function evaluateTiming(tasks) {
  const now = new Date()
  const overdueTasks = tasks.filter(
    (t) => !t.completed && new Date(t.dueDate) < now
  )
  const earlyCompleted = tasks.filter(
    (t) =>
      t.completed &&
      t.completedDate &&
      new Date(t.completedDate) < new Date(t.dueDate)
  )
  if (overdueTasks.length > 0) return "retrasado"
  if (earlyCompleted.length === tasks.length) return "adelantado"
  return "a tiempo"
}

export default function ProjectsPage() {
  const [timingFilter, setTimingFilter] = useState(null)
  const [searchText, setSearchText] = useState("")
  const router = useRouter()

  const projects = rawProjects.map((project) => ({
    ...project,
    tasksCount: project.tasks.length,
    progress: calculateProgress(project.tasks),
    timing: evaluateTiming(project.tasks),
  }))

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchText.trim() === "" ||
      project.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesTiming = timingFilter ? project.timing === timingFilter : true
    return matchesSearch && matchesTiming
  })

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold text-heading mb-2">Proyectos</h1>
        <Button onClick={() => router.push("/proyectos/nuevo")}>
          <HiFolderAdd size={16} />
          Nuevo proyecto
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
        <ProjectTimingFilter
          timingFilter={timingFilter}
          setTimingFilter={setTimingFilter}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}

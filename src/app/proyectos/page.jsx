"use client"

import { projects as rawProjects } from "@/data/projects"
import ProjectCard from "@/components/projects/ProjectCard"

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
  const projects = rawProjects.map((project) => ({
    ...project,
    tasksCount: project.tasks.length,
    progress: calculateProgress(project.tasks),
    timing: evaluateTiming(project.tasks),
  }))

  return (
    <div className="min-h-screen bg-white dark:bg-indigo-950 px-6 py-8">
      <h1 className="text-4xl font-semibold text-indigo-800 dark:text-indigo-100 mb-6">
        Proyectos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}

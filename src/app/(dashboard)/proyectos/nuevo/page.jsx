import { redirect } from "next/navigation"

// Redirigir a la página de proyectos donde se puede crear un nuevo proyecto
export default function NuevoProyectoPage() {
  redirect("/proyectos")
}

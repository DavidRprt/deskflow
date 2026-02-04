import AppSidebar from "@/components/layout/AppSidebar"
import { getSession } from "@/services/auth/authService"

export default async function DashboardLayout({ children }) {
  const session = await getSession()

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={session?.user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}

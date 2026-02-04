import {
  getDashboardStats,
  getRecentProjects,
  getUpcomingTasks,
  getFinancialSummary,
} from "@/services/dashboard/dashboardService"
import DashboardClient from "@/components/dashboard/DashboardClient"

export default async function Home() {
  const [stats, recentProjects, upcomingTasks, financialSummary] =
    await Promise.all([
      getDashboardStats(1),
      getRecentProjects(1, 5),
      getUpcomingTasks(1, 5),
      getFinancialSummary(1),
    ])

  return (
    <DashboardClient
      stats={stats}
      recentProjects={recentProjects}
      upcomingTasks={upcomingTasks}
      financialSummary={financialSummary}
    />
  )
}

import {
  getProfile,
  getProfesiones,
  getTemas,
  getUserStats,
} from "@/services/settings/settingsService"
import SettingsClient from "@/components/settings/SettingsClient"

export default async function ConfiguracionPage() {
  const [profile, profesiones, temas, stats] = await Promise.all([
    getProfile(1),
    getProfesiones(),
    getTemas(),
    getUserStats(1),
  ])

  return (
    <SettingsClient
      profile={profile}
      profesiones={profesiones}
      temas={temas}
      stats={stats}
    />
  )
}

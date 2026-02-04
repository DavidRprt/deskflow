import { getClients, getClientTypes } from "@/services/clients/clientService"
import ClientsClient from "@/components/clients/ClientsClient"

export default async function ClientsPage() {
  const [clients, clientTypes] = await Promise.all([
    getClients(1, { includeProjects: true }),
    getClientTypes(),
  ])

  return <ClientsClient clients={clients} clientTypes={clientTypes} />
}

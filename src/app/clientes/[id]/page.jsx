import { getClientById } from "@/services/clients/clientService"
import { notFound } from "next/navigation"
import ClientDetailClient from "@/components/clients/ClientDetailClient"

export default async function ClientDetailPage({ params }) {
  const { id } = await params
  const client = await getClientById(parseInt(id), 1)

  if (!client) {
    notFound()
  }

  return <ClientDetailClient client={client} />
}

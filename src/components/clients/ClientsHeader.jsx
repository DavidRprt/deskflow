"use client"

import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function ClientsHeader({ onAddClick }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-semibold text-heading">Clientes</h1>
      <Button onClick={onAddClick}>
        <IconPlus size={16} />
        Nuevo cliente
      </Button>
    </div>
  )
}

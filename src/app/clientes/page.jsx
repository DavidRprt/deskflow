"use client"

import { IconPlus } from "@tabler/icons-react"
import ClientCard from "@/components/clients/ClientCard"
import { clients as allClients } from "@/data/clients"
import NewClientForm from "@/components/clients/NewClientForm"
import ClientsHeader from "@/components/clients/ClientsHeader"
import SearchBar from "@/components/layout/SearchBar"
import { useState } from "react"
import { motion } from "motion/react"

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [active, setActive] = useState(null)

  const filteredClients = allClients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <ClientsHeader onAddClick={() => setShowForm(true)} />
      {showForm && <NewClientForm onClose={() => setShowForm(false)} />}
      <SearchBar value={search} setSearchText={setSearch} />
      <ul className="grid grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto mt-3">
        {filteredClients.map((client) => (
          <motion.div
            layoutId={`card-${client.name}`}
            key={client.id}
            onClick={() => setActive(client)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-secondary dark:hover:bg-secondary rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row items-center">
              <motion.div
                layoutId={`image-${client.name}`}
                className="h-14 w-14 rounded-full bg-primary/20 dark:bg-primary/60 flex items-center justify-center text-white text-lg font-bold"
              >
                {client.name[0]}
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${client.name}`}
                  className="font-medium text-heading text-center md:text-left"
                >
                  {client.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${client.projects}`}
                  className="text-subtle text-center md:text-left"
                >
                  {client.projects} proyectos activos
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${client.name}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-indigo-950 mt-4 md:mt-0"
            >
              Detalles
            </motion.button>
          </motion.div>
        ))}
      </ul>
      <ClientCard clients={allClients} active={active} setActive={setActive} />
    </div>
  )
}

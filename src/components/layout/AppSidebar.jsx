"use client"

import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/Sidebar"
import {
  IconFolder,
  IconCurrencyDollar,
  IconSettings,
  IconLogout,
  IconUsersGroup,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"

export default function AppSidebar() {
  const user = {
    name: "David Rapoport",
  }

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const classList = document.documentElement.classList
    if (isDark) {
      classList.add("dark")
    } else {
      classList.remove("dark")
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar>
        <SidebarBody className="justify-between gap-10 bg-background text-foreground border-r border-border">
          <div className="flex flex-col overflow-y-auto">
            <TopBar isDark={isDark} setIsDark={setIsDark} />

            <div className="mt-8 flex flex-col gap-2 px-2">
              <SidebarLink
                link={{
                  href: "/proyectos",
                  label: "Proyectos",
                  icon: (
                    <IconFolder
                      size={18}
                      className="text-primary dark:text-primary"
                    />
                  ),
                }}
              />
              <SidebarLink
                link={{
                  href: "/clientes",
                  label: "Clientes",
                  icon: (
                    <IconUsersGroup
                      size={18}
                      className="text-primary dark:text-primary"
                    />
                  ),
                }}
              />
              <SidebarLink
                link={{
                  href: "/finances",
                  label: "Finanzas",
                  icon: (
                    <IconCurrencyDollar
                      size={18}
                      className="text-primary dark:text-primary"
                    />
                  ),
                }}
              />
              <SidebarLink
                link={{
                  href: "/settings",
                  label: "Configuración",
                  icon: (
                    <IconSettings
                      size={18}
                      className="text-primary dark:text-primary"
                    />
                  ),
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 px-2 pb-4">
            <SidebarLink
              link={{
                href: "#",
                label: user.name,
                icon: (
                  <img
                    src="/perfil.jpeg"
                    className="h-7 w-7 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
            <SidebarLink
              link={{
                href: "#",
                label: "Cerrar sesión",
                icon: (
                  <IconLogout
                    size={18}
                    className="text-primary dark:text-primary"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  )
}

function TopBar({ isDark, setIsDark }) {
  const { open } = useSidebar()

  return (
    <div className="flex items-center justify-between px-2 pt-2">
      <a href="/" className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary text-primary-foreground flex items-center justify-center">
          <img src="/icon.png" alt="Logo" className="h-4 w-4 object-contain" />
        </div>
        {open && (
          <span className="text-sm font-medium text-heading">DeskFlow</span>
        )}
      </a>

      {open && (
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-primary hover:opacity-80 transition"
          title={isDark ? "Modo claro" : "Modo oscuro"}
        >
          {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>
      )}
    </div>
  )
}

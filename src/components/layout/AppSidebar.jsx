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
  IconHome,
} from "@tabler/icons-react"
import { logoutAction } from "@/actions/authActions"

export default function AppSidebar({ user }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const classList = document.documentElement.classList
    if (isDark) {
      classList.add("dark")
    } else {
      classList.remove("dark")
    }
  }, [isDark])

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar>
        <SidebarBody className="justify-between gap-10 bg-background text-foreground border-r border-border">
          <div className="flex flex-col overflow-y-auto">
            <TopBar isDark={isDark} setIsDark={setIsDark} />

            <div className="mt-8 flex flex-col gap-2 px-2">
              <SidebarLink
                link={{
                  href: "/",
                  label: "Dashboard",
                  icon: (
                    <IconHome
                      size={18}
                      className="text-primary dark:text-primary"
                    />
                  ),
                }}
              />
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
                  href: "/finanzas",
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
                  href: "/configuracion",
                  label: "Configuracion",
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

          <BottomSection user={user} handleLogout={handleLogout} />
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

function BottomSection({ user, handleLogout }) {
  const { open } = useSidebar()

  const onLogoutClick = () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      handleLogout()
    }
  }

  return (
    <div className="flex flex-col gap-2 px-2 pb-4">
      <SidebarLink
        link={{
          href: "/configuracion",
          label: user?.nombre || user?.persona?.nombre || "Usuario",
          icon: (
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
              {(user?.nombre || user?.persona?.nombre || "U")[0].toUpperCase()}
            </div>
          ),
        }}
      />
      <button
        onClick={onLogoutClick}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition w-full text-left group"
        title="Cerrar sesión"
      >
        <IconLogout size={18} className="text-muted group-hover:text-red-500 flex-shrink-0" />
        {open && <span className="text-sm">Cerrar sesión</span>}
      </button>
    </div>
  )
}

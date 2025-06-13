"use client"

import React, { useEffect, useRef, useId } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "@/hooks/useOutsideClick"
import { useRouter } from "next/navigation"
import {
  IconArrowRight,
  IconBriefcase,
  IconCalendar,
  IconX,
  IconWallet,
  IconAt,
} from "@tabler/icons-react"

export default function ClientCard({ active, setActive }) {
  const ref = useRef(null)
  const id = useId()
  const router = useRouter()

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setActive(null)
    }
    document.body.style.overflow = active ? "hidden" : "auto"
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  if (!active) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 h-full w-full z-10"
        />
      </AnimatePresence>

      <div className="fixed inset-0 grid place-items-center z-50">
        <motion.div
          layoutId={`card-${active.name}-${id}`}
          ref={ref}
          className="w-full max-w-md h-fit flex flex-col bg-card text-foreground sm:rounded-3xl overflow-hidden shadow-xl border border-border"
        >
          <div className="relative p-6">
            <button
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 text-muted hover:text-heading transition"
            >
              <IconX size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {active.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-heading">
                  {active.name}
                </h3>
                <p className="text-sm text-muted">
                  {active.projects} proyectos activos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm text-subtle">
              <div className="flex items-center gap-2">
                <IconBriefcase size={16} />
                <span>{active.type || "Empresa"}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconAt size={16} />
                <span>Canal preferido: {active.channel || "Email"}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCalendar size={16} />
                <span>
                  Último contacto:{" "}
                  {new Date(active.lastContact).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IconWallet size={16} />
                <span>
                  Pagos pendientes:{" "}
                  {active.pendingPayments
                    ? `$${active.pendingPayments}`
                    : "Ninguno"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-medium text-primary flex items-center justify-between mb-1">
                <span>Relación general</span>
                <span>{active.progress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
                <div
                  style={{ width: `${active.progress || 0}%` }}
                  className="h-full bg-primary transition-all"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => router.push(`/clientes/${active.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow hover:opacity-90 transition"
              >
                <IconArrowRight size={16} />
                Ver perfil completo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

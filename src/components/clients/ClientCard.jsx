"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "@/hooks/useOutsideClick"
import { useRouter } from "next/navigation"
import {
  IconArrowRight,
  IconBriefcase,
  IconCalendar,
  IconX,
  IconMail,
  IconPhone,
  IconWallet,
  IconChartBar,
  IconAt,
} from "@tabler/icons-react"

export default function ClientCard({ clients }) {
  const [active, setActive] = useState(null)
  const ref = useRef(null)
  const id = useId()
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false)
      }
    }
    document.body.style.overflow = active ? "hidden" : "auto"
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-50">
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-md h-fit flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700"
            >
              <div className="relative p-6">
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition"
                >
                  <IconX size={20} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-white text-lg font-bold">
                    {active.name[0]}
                  </div>
                  <div>
                    <motion.h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                      {active.name}
                    </motion.h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {active.projects} proyectos activos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm text-neutral-700 dark:text-neutral-300">
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
                      {new Date(active.lastContact).toLocaleDateString(
                        "es-AR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
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
                  <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center justify-between mb-1">
                    <span>Relación general</span>
                    <span>{active.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-200 dark:bg-indigo-800 rounded-sm overflow-hidden">
                    <div
                      style={{ width: `${active.progress || 0}%` }}
                      className="h-full bg-indigo-600 dark:bg-indigo-300 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => router.push(`/clientes/${active.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-700 dark:bg-indigo-300 text-white dark:text-indigo-950 text-sm font-medium shadow hover:opacity-90 transition"
                  >
                    <IconArrowRight size={16} />
                    Ver perfil completo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="grid grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto px-2">
        {clients.map((card) => (
          <motion.div
            layoutId={`card-${card.name}-${id}`}
            key={`card-${card.name}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row items-center">
              <motion.div
                layoutId={`image-${card.name}-${id}`}
                className="h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-white text-lg font-bold"
              >
                {card.name[0]}
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${card.name}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.projects}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.projects} proyectos activos
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.name}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold text-white dark:text-indigo-950 bg-indigo-700 dark:bg-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-200 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-indigo-950 mt-4 md:mt-0"
            >
              Detalles
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

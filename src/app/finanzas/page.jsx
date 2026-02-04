import {
  getGastos,
  getIngresos,
  getMonedas,
  getFinancialSummary,
  getProyectosForSelect,
} from "@/services/finances/financeService"
import FinancesClient from "@/components/finances/FinancesClient"

export default async function FinanzasPage() {
  const [gastos, ingresos, monedas, summary, proyectos] = await Promise.all([
    getGastos(1),
    getIngresos(1),
    getMonedas(),
    getFinancialSummary(1),
    getProyectosForSelect(1),
  ])

  return (
    <FinancesClient
      gastos={gastos}
      ingresos={ingresos}
      monedas={monedas}
      summary={summary}
      proyectos={proyectos}
    />
  )
}

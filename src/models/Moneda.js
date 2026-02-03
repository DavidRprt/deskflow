import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Moneda
 *
 * Representa las monedas disponibles para registrar gastos e ingresos.
 * Permite manejar múltiples divisas en el sistema.
 * Ejemplos: ARS (Peso Argentino), USD (Dólar), EUR (Euro)
 *
 * Relaciones:
 * - Una Moneda puede tener muchos Gastos (hasMany)
 * - Una Moneda puede tener muchos Ingresos (hasMany)
 */
const Moneda = sequelize.define(
  "Moneda",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    simbolo: {
      type: DataTypes.STRING(5),
    },
  },
  {
    tableName: "moneda",
    timestamps: false,
  }
)

export default Moneda

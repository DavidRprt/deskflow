import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Estado
 *
 * Representa los estados posibles para proyectos y tareas.
 * Cada estado tiene un nombre único y un color asociado para la UI.
 * Ejemplos: "En curso", "Completado", "Cancelado", "En pausa"
 *
 * Relaciones:
 * - Un Estado puede tener muchos Proyectos (hasMany)
 * - Un Estado puede tener muchas Tareas (hasMany)
 */
const Estado = sequelize.define(
  "Estado",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING(7),
    },
  },
  {
    tableName: "estado",
    timestamps: false,
  }
)

export default Estado

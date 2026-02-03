import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Profesion
 *
 * Representa las profesiones disponibles en el sistema.
 * Cada profesión puede tener múltiples skills asociados.
 * Ejemplos: "Desarrollador Web", "Diseñador UX", "Project Manager"
 *
 * Relaciones:
 * - Una Profesion puede tener muchas Personas (hasMany)
 * - Una Profesion puede tener muchos Skills (belongsToMany via profesion_skill)
 */
const Profesion = sequelize.define(
  "Profesion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "profesion",
    timestamps: false,
  }
)

export default Profesion

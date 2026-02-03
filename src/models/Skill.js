import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Skill
 *
 * Representa las habilidades o competencias disponibles en el sistema.
 * Los skills se asocian a profesiones para indicar qué habilidades
 * son relevantes para cada tipo de trabajo.
 * Ejemplos: "JavaScript", "Figma", "Gestión de proyectos"
 *
 * Relaciones:
 * - Un Skill puede pertenecer a muchas Profesiones (belongsToMany via profesion_skill)
 */
const Skill = sequelize.define(
  "Skill",
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
  },
  {
    tableName: "skill",
    timestamps: false,
  }
)

export default Skill

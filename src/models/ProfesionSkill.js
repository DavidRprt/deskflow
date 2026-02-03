import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo ProfesionSkill (Tabla Pivote)
 *
 * Tabla intermedia que relaciona Profesiones con Skills.
 * Permite definir qué habilidades son relevantes para cada profesión.
 * La clave primaria es compuesta (profesion_id, skill_id).
 *
 * Ejemplo: La profesión "Desarrollador Web" puede tener skills como
 * "JavaScript", "React", "Node.js", etc.
 */
const ProfesionSkill = sequelize.define(
  "ProfesionSkill",
  {
    profesion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "profesion",
        key: "id",
      },
    },
    skill_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "skill",
        key: "id",
      },
    },
  },
  {
    tableName: "profesion_skill",
    timestamps: false,
  }
)

export default ProfesionSkill

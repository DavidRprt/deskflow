import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo PersonaTemaVisual (Tabla Pivote)
 *
 * Tabla intermedia que relaciona Personas con TemasVisuales.
 * Registra qué temas visuales ha comprado/desbloqueado cada persona.
 * La clave primaria es compuesta (persona_id, tema_visual_id).
 *
 * Nota: El tema actualmente en uso se guarda en persona.tema_preferido_id,
 * mientras que esta tabla guarda todos los temas disponibles para el usuario.
 */
const PersonaTemaVisual = sequelize.define(
  "PersonaTemaVisual",
  {
    persona_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "persona",
        key: "id",
      },
    },
    tema_visual_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "tema_visual",
        key: "id",
      },
    },
  },
  {
    tableName: "persona_tema_visual",
    timestamps: false,
  }
)

export default PersonaTemaVisual

import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo TemaVisual
 *
 * Representa los temas visuales/skins disponibles para personalizar la UI.
 * Cada tema define colores para modo claro y oscuro, y puede tener un precio
 * (para temas premium). Los usuarios pueden comprar temas y seleccionar
 * uno como preferido.
 *
 * Relaciones:
 * - Un TemaVisual puede ser preferido por muchas Personas (hasMany - tema_preferido_id)
 * - Un TemaVisual puede ser comprado por muchas Personas (belongsToMany via persona_tema_visual)
 */
const TemaVisual = sequelize.define(
  "TemaVisual",
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
    color_primario: {
      type: DataTypes.STRING(7),
    },
    color_secundario: {
      type: DataTypes.STRING(7),
    },
    color_background: {
      type: DataTypes.STRING(7),
    },
    color_primario_dark: {
      type: DataTypes.STRING(7),
    },
    color_secundario_dark: {
      type: DataTypes.STRING(7),
    },
    color_background_dark: {
      type: DataTypes.STRING(7),
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
    },
    icono: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "tema_visual",
    timestamps: false,
  }
)

export default TemaVisual

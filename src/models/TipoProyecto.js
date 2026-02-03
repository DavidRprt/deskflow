import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo TipoProyecto
 *
 * Representa las categorías de proyectos disponibles en el sistema.
 * Permite clasificar proyectos según su tipo (Web, Mobile, Diseño, etc.)
 *
 * Relaciones:
 * - Un TipoProyecto puede tener muchos Proyectos (hasMany)
 */
const TipoProyecto = sequelize.define(
  "TipoProyecto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "tipo_proyecto",
    timestamps: false,
  }
)

export default TipoProyecto

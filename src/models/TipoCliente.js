import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo TipoCliente
 *
 * Representa las categorías de clientes disponibles en el sistema.
 * Permite clasificar clientes según su naturaleza (Empresa, Startup, Particular, etc.)
 *
 * Relaciones:
 * - Un TipoCliente puede tener muchos Clientes (hasMany)
 */
const TipoCliente = sequelize.define(
  "TipoCliente",
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
  },
  {
    tableName: "tipo_cliente",
    timestamps: false,
  }
)

export default TipoCliente

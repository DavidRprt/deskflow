import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Ingreso
 *
 * Representa los ingresos del freelancer, ya sean pagos de proyectos
 * o ingresos generales. Permite trackear el flujo de dinero entrante.
 *
 * Relaciones:
 * - Un Ingreso pertenece a un Usuario (belongsTo) - quien registró el ingreso
 * - Un Ingreso puede pertenecer a un Proyecto (belongsTo) - opcional
 * - Un Ingreso pertenece a una Moneda (belongsTo)
 */
const Ingreso = sequelize.define(
  "Ingreso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    proyecto_id: {
      type: DataTypes.INTEGER,
    },
    moneda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ingreso",
    timestamps: false,
  }
)

export default Ingreso

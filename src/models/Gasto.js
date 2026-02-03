import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Gasto
 *
 * Representa los gastos del freelancer, ya sean asociados a un proyecto
 * específico o gastos generales del negocio. Permite marcar si el gasto
 * es deducible de impuestos.
 *
 * Relaciones:
 * - Un Gasto pertenece a un Usuario (belongsTo) - quien registró el gasto
 * - Un Gasto puede pertenecer a un Proyecto (belongsTo) - opcional
 * - Un Gasto pertenece a una Moneda (belongsTo)
 */
const Gasto = sequelize.define(
  "Gasto",
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
    es_deducible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "gasto",
    timestamps: false,
  }
)

export default Gasto

import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Cliente
 *
 * Representa los clientes del freelancer. Cada cliente pertenece a una persona
 * (el freelancer dueño) y puede tener múltiples proyectos asociados.
 *
 * Relaciones:
 * - Un Cliente pertenece a una Persona (belongsTo)
 * - Un Cliente pertenece a un TipoCliente (belongsTo)
 * - Un Cliente puede tener muchos Proyectos (hasMany)
 */
const Cliente = sequelize.define(
  "Cliente",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
    },
    email: {
      type: DataTypes.STRING(150),
    },
    tipo_cliente_id: {
      type: DataTypes.INTEGER,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fecha_alta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cliente",
    timestamps: false,
  }
)

export default Cliente

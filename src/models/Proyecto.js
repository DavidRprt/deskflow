import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Proyecto
 *
 * Representa los proyectos de trabajo del freelancer. Cada proyecto está
 * asociado a un cliente y contiene información de presupuesto, gastos,
 * fechas y estado.
 *
 * Relaciones:
 * - Un Proyecto pertenece a una Persona (belongsTo) - el freelancer dueño
 * - Un Proyecto pertenece a un Cliente (belongsTo)
 * - Un Proyecto pertenece a un TipoProyecto (belongsTo)
 * - Un Proyecto pertenece a un Estado (belongsTo)
 * - Un Proyecto puede tener muchas Tareas (hasMany)
 */
const Proyecto = sequelize.define(
  "Proyecto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_proyecto_id: {
      type: DataTypes.INTEGER,
    },
    presupuesto: {
      type: DataTypes.DECIMAL(14, 2),
    },
    gastos: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0,
    },
    estado_id: {
      type: DataTypes.INTEGER,
    },
    archivado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fijado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pagado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: "proyecto",
    timestamps: false,
  }
)

export default Proyecto

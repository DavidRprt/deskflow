import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

const Tarea = sequelize.define(
  "Tarea",
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
    importancia: {
      type: DataTypes.SMALLINT,
    },
    duracion_estimada: {
      type: DataTypes.INTEGER,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    estado_id: {
      type: DataTypes.INTEGER,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
    },
    proyecto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tarea",
    timestamps: false,
  }
)

export default Tarea

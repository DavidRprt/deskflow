import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

const Persona = sequelize.define(
  "Persona",
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
    avatar: {
      type: DataTypes.STRING(255),
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
    },
    idioma_preferido: {
      type: DataTypes.STRING(20),
    },
    tema_preferido_id: {
      type: DataTypes.INTEGER,
    },
    modo_oscuro: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profesion_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "persona",
    timestamps: false,
  }
)

export default Persona

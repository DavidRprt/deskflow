import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

const Estado = sequelize.define(
  "Estado",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(7),
    },
  },
  {
    tableName: "estado",
    timestamps: false,
  }
)

export default Estado

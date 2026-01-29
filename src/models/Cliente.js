import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

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
    email: {
      type: DataTypes.STRING(150),
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

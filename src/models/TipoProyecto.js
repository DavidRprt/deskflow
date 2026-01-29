import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

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
    },
  },
  {
    tableName: "tipo_proyecto",
    timestamps: false,
  }
)

export default TipoProyecto

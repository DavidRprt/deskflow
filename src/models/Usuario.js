import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Usuario
 *
 * Maneja la autenticación del sistema. Cada usuario está vinculado
 * a una Persona que contiene sus datos de perfil.
 * Esta separación permite tener datos de autenticación desacoplados
 * de los datos personales.
 *
 * Relaciones:
 * - Un Usuario pertenece a una Persona (belongsTo) - relación 1:1
 */
const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    estado_cuenta: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ultimo_login: {
      type: DataTypes.DATE,
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  }
)

export default Usuario

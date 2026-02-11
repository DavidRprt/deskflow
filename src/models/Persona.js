import { DataTypes } from "sequelize"
import sequelize from "@/lib/db"

/**
 * Modelo Persona
 *
 * Representa los datos personales y preferencias del usuario.
 * Está separado de Usuario para mantener la autenticación desacoplada
 * de los datos de perfil.
 *
 * Relaciones:
 * - Una Persona tiene un Usuario (hasOne)
 * - Una Persona pertenece a una Profesion (belongsTo)
 * - Una Persona pertenece a un TemaVisual preferido (belongsTo)
 * - Una Persona puede tener muchos TemasVisuales comprados (belongsToMany via persona_tema_visual)
 * - Una Persona puede tener muchos Clientes (hasMany)
 * - Una Persona puede tener muchos Proyectos (hasMany)
 */
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
      type: DataTypes.TEXT, // Base64 encoded image
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

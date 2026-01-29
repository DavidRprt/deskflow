import sequelize from "@/lib/db"
import Proyecto from "./Proyecto"
import Cliente from "./Cliente"
import TipoProyecto from "./TipoProyecto"
import TipoCliente from "./TipoCliente"
import Estado from "./Estado"
import Persona from "./Persona"
import Tarea from "./Tarea"

// Proyecto relations
Proyecto.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
})

Proyecto.belongsTo(TipoProyecto, {
  foreignKey: "tipo_proyecto_id",
  as: "tipoProyecto",
})

Proyecto.belongsTo(Estado, {
  foreignKey: "estado_id",
  as: "estado",
})

Proyecto.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
})

Proyecto.hasMany(Tarea, {
  foreignKey: "proyecto_id",
  as: "tareas",
})

// Cliente relations
Cliente.hasMany(Proyecto, {
  foreignKey: "cliente_id",
  as: "proyectos",
})

Cliente.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
})

Cliente.belongsTo(TipoCliente, {
  foreignKey: "tipo_cliente_id",
  as: "tipoCliente",
})

// Tarea relations
Tarea.belongsTo(Proyecto, {
  foreignKey: "proyecto_id",
  as: "proyecto",
})

Tarea.belongsTo(Estado, {
  foreignKey: "estado_id",
  as: "estado",
})

export {
  sequelize,
  Proyecto,
  Cliente,
  TipoProyecto,
  TipoCliente,
  Estado,
  Persona,
  Tarea,
}

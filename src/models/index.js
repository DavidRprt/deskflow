import sequelize from "@/lib/db"

// Modelos principales
import Usuario from "./Usuario"
import Persona from "./Persona"
import Cliente from "./Cliente"
import Proyecto from "./Proyecto"
import Tarea from "./Tarea"

// Modelos financieros
import Moneda from "./Moneda"
import Gasto from "./Gasto"
import Ingreso from "./Ingreso"

// Modelos catálogo
import Estado from "./Estado"
import TipoCliente from "./TipoCliente"
import TipoProyecto from "./TipoProyecto"
import Profesion from "./Profesion"
import Skill from "./Skill"
import TemaVisual from "./TemaVisual"

// Modelos pivote
import ProfesionSkill from "./ProfesionSkill"
import PersonaTemaVisual from "./PersonaTemaVisual"

// ============================================
// RELACIONES DE USUARIO
// ============================================

/**
 * Usuario - Persona (1:1)
 * Cada usuario tiene exactamente una persona asociada con sus datos de perfil
 */
Usuario.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
})

Persona.hasOne(Usuario, {
  foreignKey: "persona_id",
  as: "usuario",
})

/**
 * Usuario - Gasto (1:N)
 * Un usuario puede registrar múltiples gastos
 */
Usuario.hasMany(Gasto, {
  foreignKey: "usuario_id",
  as: "gastos",
})

/**
 * Usuario - Ingreso (1:N)
 * Un usuario puede registrar múltiples ingresos
 */
Usuario.hasMany(Ingreso, {
  foreignKey: "usuario_id",
  as: "ingresos",
})

// ============================================
// RELACIONES DE PERSONA
// ============================================

/**
 * Persona - Profesion (N:1)
 * Una persona puede tener una profesión, una profesión puede tener muchas personas
 */
Persona.belongsTo(Profesion, {
  foreignKey: "profesion_id",
  as: "profesion",
})

Profesion.hasMany(Persona, {
  foreignKey: "profesion_id",
  as: "personas",
})

/**
 * Persona - TemaVisual preferido (N:1)
 * Una persona puede tener un tema visual preferido activo
 */
Persona.belongsTo(TemaVisual, {
  foreignKey: "tema_preferido_id",
  as: "temaPreferido",
})

TemaVisual.hasMany(Persona, {
  foreignKey: "tema_preferido_id",
  as: "personasConTemaActivo",
})

/**
 * Persona - TemaVisual comprados (N:M)
 * Una persona puede comprar múltiples temas, un tema puede ser comprado por múltiples personas
 */
Persona.belongsToMany(TemaVisual, {
  through: PersonaTemaVisual,
  foreignKey: "persona_id",
  otherKey: "tema_visual_id",
  as: "temasComprados",
})

TemaVisual.belongsToMany(Persona, {
  through: PersonaTemaVisual,
  foreignKey: "tema_visual_id",
  otherKey: "persona_id",
  as: "compradores",
})

/**
 * Persona - Cliente (1:N)
 * Una persona (freelancer) puede tener múltiples clientes
 */
Persona.hasMany(Cliente, {
  foreignKey: "persona_id",
  as: "clientes",
})

/**
 * Persona - Proyecto (1:N)
 * Una persona (freelancer) puede tener múltiples proyectos
 */
Persona.hasMany(Proyecto, {
  foreignKey: "persona_id",
  as: "proyectos",
})

// ============================================
// RELACIONES DE CLIENTE
// ============================================

/**
 * Cliente - Persona (N:1)
 * Un cliente pertenece a una persona (el freelancer dueño)
 */
Cliente.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
})

/**
 * Cliente - TipoCliente (N:1)
 * Un cliente tiene un tipo (Empresa, Startup, Particular, etc.)
 */
Cliente.belongsTo(TipoCliente, {
  foreignKey: "tipo_cliente_id",
  as: "tipoCliente",
})

TipoCliente.hasMany(Cliente, {
  foreignKey: "tipo_cliente_id",
  as: "clientes",
})

/**
 * Cliente - Proyecto (1:N)
 * Un cliente puede tener múltiples proyectos
 */
Cliente.hasMany(Proyecto, {
  foreignKey: "cliente_id",
  as: "proyectos",
})

// ============================================
// RELACIONES DE PROYECTO
// ============================================

/**
 * Proyecto - Persona (N:1)
 * Un proyecto pertenece a una persona (el freelancer)
 */
Proyecto.belongsTo(Persona, {
  foreignKey: "persona_id",
  as: "persona",
})

/**
 * Proyecto - Cliente (N:1)
 * Un proyecto pertenece a un cliente
 */
Proyecto.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
})

/**
 * Proyecto - TipoProyecto (N:1)
 * Un proyecto tiene un tipo (Web, Mobile, Diseño, etc.)
 */
Proyecto.belongsTo(TipoProyecto, {
  foreignKey: "tipo_proyecto_id",
  as: "tipoProyecto",
})

TipoProyecto.hasMany(Proyecto, {
  foreignKey: "tipo_proyecto_id",
  as: "proyectos",
})

/**
 * Proyecto - Estado (N:1)
 * Un proyecto tiene un estado (En curso, Completado, etc.)
 */
Proyecto.belongsTo(Estado, {
  foreignKey: "estado_id",
  as: "estado",
})

Estado.hasMany(Proyecto, {
  foreignKey: "estado_id",
  as: "proyectos",
})

/**
 * Proyecto - Tarea (1:N)
 * Un proyecto puede tener múltiples tareas
 */
Proyecto.hasMany(Tarea, {
  foreignKey: "proyecto_id",
  as: "tareas",
})

/**
 * Proyecto - Gasto (1:N)
 * Un proyecto puede tener múltiples registros de gastos asociados
 * Nota: Se usa "registrosGastos" porque el modelo Proyecto ya tiene un campo "gastos" (DECIMAL)
 */
Proyecto.hasMany(Gasto, {
  foreignKey: "proyecto_id",
  as: "registrosGastos",
})

/**
 * Proyecto - Ingreso (1:N)
 * Un proyecto puede tener múltiples registros de ingresos asociados
 */
Proyecto.hasMany(Ingreso, {
  foreignKey: "proyecto_id",
  as: "registrosIngresos",
})

// ============================================
// RELACIONES DE TAREA
// ============================================

/**
 * Tarea - Proyecto (N:1)
 * Una tarea pertenece a un proyecto
 */
Tarea.belongsTo(Proyecto, {
  foreignKey: "proyecto_id",
  as: "proyecto",
})

/**
 * Tarea - Estado (N:1)
 * Una tarea tiene un estado (Pendiente, En progreso, Completada, etc.)
 */
Tarea.belongsTo(Estado, {
  foreignKey: "estado_id",
  as: "estado",
})

Estado.hasMany(Tarea, {
  foreignKey: "estado_id",
  as: "tareas",
})

// ============================================
// RELACIONES DE GASTO
// ============================================

/**
 * Gasto - Usuario (N:1)
 * Un gasto pertenece al usuario que lo registró
 */
Gasto.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
})

/**
 * Gasto - Proyecto (N:1)
 * Un gasto puede estar asociado a un proyecto (opcional)
 */
Gasto.belongsTo(Proyecto, {
  foreignKey: "proyecto_id",
  as: "proyecto",
})

/**
 * Gasto - Moneda (N:1)
 * Un gasto está expresado en una moneda
 */
Gasto.belongsTo(Moneda, {
  foreignKey: "moneda_id",
  as: "moneda",
})

Moneda.hasMany(Gasto, {
  foreignKey: "moneda_id",
  as: "gastos",
})

// ============================================
// RELACIONES DE INGRESO
// ============================================

/**
 * Ingreso - Usuario (N:1)
 * Un ingreso pertenece al usuario que lo registró
 */
Ingreso.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
})

/**
 * Ingreso - Proyecto (N:1)
 * Un ingreso puede estar asociado a un proyecto (opcional)
 */
Ingreso.belongsTo(Proyecto, {
  foreignKey: "proyecto_id",
  as: "proyecto",
})

/**
 * Ingreso - Moneda (N:1)
 * Un ingreso está expresado en una moneda
 */
Ingreso.belongsTo(Moneda, {
  foreignKey: "moneda_id",
  as: "moneda",
})

Moneda.hasMany(Ingreso, {
  foreignKey: "moneda_id",
  as: "ingresos",
})

// ============================================
// RELACIONES DE PROFESION Y SKILL
// ============================================

/**
 * Profesion - Skill (N:M)
 * Una profesión puede requerir múltiples skills,
 * un skill puede ser relevante para múltiples profesiones
 */
Profesion.belongsToMany(Skill, {
  through: ProfesionSkill,
  foreignKey: "profesion_id",
  otherKey: "skill_id",
  as: "skills",
})

Skill.belongsToMany(Profesion, {
  through: ProfesionSkill,
  foreignKey: "skill_id",
  otherKey: "profesion_id",
  as: "profesiones",
})

// ============================================
// EXPORTACIONES
// ============================================

export {
  sequelize,
  // Modelos principales
  Usuario,
  Persona,
  Cliente,
  Proyecto,
  Tarea,
  // Modelos financieros
  Moneda,
  Gasto,
  Ingreso,
  // Modelos catálogo
  Estado,
  TipoCliente,
  TipoProyecto,
  Profesion,
  Skill,
  TemaVisual,
  // Modelos pivote
  ProfesionSkill,
  PersonaTemaVisual,
}

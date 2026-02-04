import { Usuario, Persona } from "@/models"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "deskflow-secret-key-change-in-production"
)
const COOKIE_NAME = "deskflow-session"

/**
 * Hashea una contraseña
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

/**
 * Verifica una contraseña contra su hash
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

/**
 * Genera un token JWT
 */
export async function generateToken(userId, personaId) {
  return new SignJWT({ userId, personaId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)
}

/**
 * Verifica un token JWT
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

/**
 * Registra un nuevo usuario
 */
export async function register(data) {
  try {
    const { email, password, nombre } = data

    // Validaciones
    if (!email || !password || !nombre) {
      throw new Error("Todos los campos son requeridos")
    }
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres")
    }

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) {
      throw new Error("El email ya está registrado")
    }

    // Crear persona primero
    const persona = await Persona.create({
      nombre: nombre.trim(),
      modo_oscuro: false,
    })

    // Hashear contraseña y crear usuario
    const passwordHash = await hashPassword(password)
    const usuario = await Usuario.create({
      email: email.toLowerCase().trim(),
      nombre: nombre.trim(),
      password_hash: passwordHash,
      estado_cuenta: true,
      persona_id: persona.id,
    })

    // Generar token
    const token = await generateToken(usuario.id, persona.id)

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        personaId: persona.id,
      },
      token,
    }
  } catch (error) {
    console.error("Error in register:", error)
    throw error
  }
}

/**
 * Inicia sesión
 */
export async function login(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos")
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({
      where: { email: email.toLowerCase().trim() },
    })

    if (!usuario) {
      throw new Error("Credenciales inválidas")
    }

    if (!usuario.estado_cuenta) {
      throw new Error("La cuenta está desactivada")
    }

    // Verificar contraseña
    const isValid = await verifyPassword(password, usuario.password_hash)
    if (!isValid) {
      throw new Error("Credenciales inválidas")
    }

    // Actualizar último login
    await usuario.update({ ultimo_login: new Date() })

    // Generar token
    const token = await generateToken(usuario.id, usuario.persona_id)

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        personaId: usuario.persona_id,
      },
      token,
    }
  } catch (error) {
    console.error("Error in login:", error)
    throw error
  }
}

/**
 * Cambia la contraseña
 */
export async function changePassword(userId, currentPassword, newPassword) {
  try {
    if (!currentPassword || !newPassword) {
      throw new Error("Ambas contraseñas son requeridas")
    }
    if (newPassword.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
    }

    const usuario = await Usuario.findByPk(userId)
    if (!usuario) {
      throw new Error("Usuario no encontrado")
    }

    // Verificar contraseña actual
    const isValid = await verifyPassword(currentPassword, usuario.password_hash)
    if (!isValid) {
      throw new Error("La contraseña actual es incorrecta")
    }

    // Actualizar contraseña
    const newHash = await hashPassword(newPassword)
    await usuario.update({ password_hash: newHash })

    return true
  } catch (error) {
    console.error("Error in changePassword:", error)
    throw error
  }
}

/**
 * Obtiene la sesión actual desde las cookies
 */
export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Obtener usuario con persona
    const usuario = await Usuario.findByPk(payload.userId, {
      include: [
        {
          model: Persona,
          as: "persona",
          attributes: ["id", "nombre", "avatar", "modo_oscuro"],
        },
      ],
    })

    if (!usuario || !usuario.estado_cuenta) {
      return null
    }

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        personaId: usuario.persona_id,
        persona: usuario.persona?.toJSON(),
      },
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

/**
 * Establece la cookie de sesión
 */
export async function setSessionCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  })
}

/**
 * Elimina la cookie de sesión
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

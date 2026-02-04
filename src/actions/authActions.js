"use server"

import { redirect } from "next/navigation"
import {
  register,
  login,
  changePassword,
  getSession,
  setSessionCookie,
  clearSessionCookie,
} from "@/services/auth/authService"

export async function registerAction(formData) {
  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      nombre: formData.get("nombre"),
    }

    const result = await register(data)
    await setSessionCookie(result.token)

    return { success: true, data: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function loginAction(formData) {
  try {
    const email = formData.get("email")
    const password = formData.get("password")

    const result = await login(email, password)
    await setSessionCookie(result.token)

    return { success: true, data: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect("/login")
}

export async function changePasswordAction(formData) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "No hay sesión activa" }
    }

    const currentPassword = formData.get("currentPassword")
    const newPassword = formData.get("newPassword")
    const confirmPassword = formData.get("confirmPassword")

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Las contraseñas no coinciden" }
    }

    await changePassword(session.user.id, currentPassword, newPassword)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getSessionAction() {
  try {
    const session = await getSession()
    return { success: true, data: session }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

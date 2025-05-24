import "./globals.css"
import AppSidebar from "@/components/layout/AppSidebar"

export const metadata = {
  title: "FlowDesk",
  description: "Tu espacio freelance centralizado.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}

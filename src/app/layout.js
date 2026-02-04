import "./globals.css"

export const metadata = {
  title: "DeskFlow",
  description: "Tu espacio freelance centralizado.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

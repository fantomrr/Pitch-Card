import { Analytics } from "@vercel/analytics/react"
import type React from "react" // Import React

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Pitch Card Generator</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'
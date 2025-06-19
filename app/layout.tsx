import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EcoShop - Your One-Stop Shopping Destination",
  description: "Discover quality products at unbeatable prices. Shop electronics, clothing, and more with fast, secure delivery.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 
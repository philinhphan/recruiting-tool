import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flash Hire',
  description: 'A platform to better match candidates with open positions through personality tests and open questions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

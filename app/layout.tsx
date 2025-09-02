import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Period Tracker - Your Personal Cycle Companion',
  description: 'Comprehensive offline-first period tracking app with logging, predictions, symptoms tracking, notes, reminders, and insights.',
  generator: 'Next.js',
  icons: {
    icon: '/icon.jpg',
  },
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-serif">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

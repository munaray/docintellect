import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import Navbar from '@/components/Navbar'
import Provider from '@/components/Provider'
import "react-loading-skeleton/dist/skeleton.css"
import "simplebar-react/dist/simplebar.min.css"

import { Toaster } from '@/components/ui/toaster'


const fontSans = FontSans({
  subsets: ['latin'],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700","800", "900"]
})

export const metadata: Metadata = {
  title: 'Docintellect',
  description: 'A web app to query your pdf in seconds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <Provider>
        <body className={cn("min-h-screen font-sans antialiased grainy", fontSans.variable)}>
          <Toaster />
          <Navbar/>
          {children}
        </body>
      </Provider>
    </html>
  )
}

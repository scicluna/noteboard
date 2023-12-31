import './globals.css'
import type { Metadata } from 'next'
import Provider from './contexts/Session'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Provider>
        <body>
          <main className='h-[100dvh]'>
            {children}
          </main>
        </body>
      </Provider>
    </html>
  )
}

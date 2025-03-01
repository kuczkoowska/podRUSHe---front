import '@/app/globals.css'
import AuthProvider from '../components/AuthProvider'
import Navigation from '../components/Navigation'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={'min-h-full flex flex-col'}>
        <AuthProvider>
          <header className="p-4 bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md">
            <Navigation />
          </header>
          <main className="container mx-auto flex-grow p-4">
            {children}
          </main>
          <footer className="p-4 bg-gray-800 text-white text-center">
            <p>&copy; 2025 Podrushe. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
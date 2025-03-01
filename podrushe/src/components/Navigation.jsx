'use client'

import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export default function Navigation() {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <nav className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-extrabold">podRUSHe</h1>
      <ul className="flex space-x-4">
        <li><a href="/packages">Packages</a></li>
        {isLoggedIn ? (
          <>
          <li><a href="/bookings">Bookings</a></li>
          <li><a href="/profile">Profile</a></li>
          </>
        ) : (<li>
          <a href="/auth/login">Log in</a>
        </li>)}
        
      </ul>
    </nav>
  )
}
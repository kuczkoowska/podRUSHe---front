'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loginStatus)
  }, [])

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('token')
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
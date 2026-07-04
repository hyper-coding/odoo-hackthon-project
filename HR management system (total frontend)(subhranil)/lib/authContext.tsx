'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'admin'
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User | string, password?: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock credentials for demo
const CREDENTIALS = {
  employee: {
    email: 'john.anderson@company.com',
    password: 'password123',
    user: {
      id: 'EMP001',
      name: 'John Anderson',
      email: 'john.anderson@company.com',
      role: 'employee' as const,
      avatar: 'JA'
    }
  },
  admin: {
    email: 'sarah.mitchell@company.com',
    password: 'password123',
    user: {
      id: 'ADM001',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      role: 'admin' as const,
      avatar: 'SM'
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('[v0] Failed to parse stored user:', error)
        localStorage.removeItem('ems_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User | string, password?: string): boolean => {
    // If userData is a User object, set it directly (from login page)
    if (typeof userData === 'object' && userData !== null) {
      setUser(userData)
      localStorage.setItem('ems_user', JSON.stringify(userData))
      return true
    }
    
    // Otherwise, validate email/password (backward compatibility)
    const email = userData as string
    for (const [, cred] of Object.entries(CREDENTIALS)) {
      if (cred.email === email && cred.password === password) {
        setUser(cred.user)
        localStorage.setItem('ems_user', JSON.stringify(cred.user))
        return true
      }
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ems_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

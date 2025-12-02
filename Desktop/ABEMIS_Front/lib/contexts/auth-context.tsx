'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '../types'
import { getSession, signOut as mockSignOut, signIn as mockSignIn, saveSession } from '../mock/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentSession = getSession()
    if (currentSession) {
      setSession(currentSession)
      setUser(currentSession.user)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = mockSignIn(email, password)
      
      if (result.success && result.user) {
        saveSession(result.user)
        const newSession = getSession()
        if (newSession) {
          setSession(newSession)
          setUser(newSession.user)
        }
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' }
    }
  }

  const signOut = () => {
    mockSignOut()
    setUser(null)
    setSession(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

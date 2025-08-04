'use client'

import { createContext, useContext, useState } from 'react'

// Mock User type for development
interface MockUser {
  id: string
  email?: string
  name?: string
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(false)

  const signOut = async () => {
    // Mock sign out - in production this would call supabase.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthTokens } from '../types/auth'
import { authApi } from '../lib/api/auth'
import { userApi } from '../lib/api/user'
import { apiClient } from '../lib/api/client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (phoneNumber: string, password: string) => Promise<void>
  register: (phoneNumber: string, password: string, name?: string, email?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const profile = await userApi.getProfile()
        setUser({
          id: profile.id,
          phoneNumber: profile.phoneNumber,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          role: profile.role,
          isPhoneVerified: profile.isPhoneVerified,
          hasPin: profile.hasPin,
        })
      }
    } catch (error) {
      // Token might be invalid, clear it
      apiClient.clearAuthTokens()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (phoneNumber: string, password: string) => {
    const response = await authApi.login({ phoneNumber, password })
    // Tokens are already stored by authApi.login
    setUser(response.user)
  }

  const register = async (
    phoneNumber: string,
    password: string,
    name?: string,
    email?: string
  ) => {
    const response = await authApi.register({ phoneNumber, password, name, email })
    // Tokens are already stored by authApi.register
    setUser(response.user)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null)
      apiClient.clearAuthTokens()
    }
  }

  const refreshUser = async () => {
    const profile = await userApi.getProfile()
    setUser({
      id: profile.id,
      phoneNumber: profile.phoneNumber,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: profile.role,
      isPhoneVerified: profile.isPhoneVerified,
      hasPin: profile.hasPin,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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

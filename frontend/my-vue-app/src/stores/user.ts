import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  role: 'user' | 'seller' | 'admin'
  verified: boolean
  createdAt: string
  preferences: {
    language: string
    currency: string
    notifications: boolean
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSeller = computed(() => user.value?.role === 'seller')
  const userName = computed(() => user.value?.name || 'Пользователь')

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      if (!response.ok) {
        throw new Error('Неверные учетные данные')
      }
      
      const data = await response.json()
      
      token.value = data.token
      user.value = data.user
      
      localStorage.setItem('token', data.token)
      
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка входа'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        throw new Error('Ошибка регистрации')
      }
      
      const data = await response.json()
      
      token.value = data.token
      user.value = data.user
      
      localStorage.setItem('token', data.token)
      
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка регистрации'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    error.value = null
  }

  const fetchProfile = async () => {
    if (!token.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки профиля')
      }
      
      const userData = await response.json()
      user.value = userData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки профиля'
      // If token is invalid, logout
      if (err instanceof Error && err.message.includes('401')) {
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!token.value) return { success: false, error: 'Не авторизован' }
    
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error('Ошибка обновления профиля')
      }
      
      const updatedUser = await response.json()
      user.value = updatedUser
      
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка обновления профиля'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize user if token exists
  if (token.value && !user.value) {
    fetchProfile()
  }

  return {
    // State
    user,
    isLoading,
    error,
    token,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isSeller,
    userName,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
  }
}) 
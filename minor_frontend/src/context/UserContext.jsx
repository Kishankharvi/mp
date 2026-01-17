"use client"

import { createContext, useState, useEffect } from "react"
import { register as apiRegister, login as apiLogin } from "./../services/api"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      if (storedToken) {
        setToken(storedToken)
      }
    } catch (error) {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials)

      const userData = response.user || response
      const tokenData = response.token

      setUser(userData)
      setToken(tokenData)
      localStorage.setItem("user", JSON.stringify(userData))
      if (tokenData) {
        localStorage.setItem("token", tokenData)
      }
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData)

      const newUser = response.user || response
      const tokenData = response.token

      setUser(newUser)
      setToken(tokenData)
      localStorage.setItem("user", JSON.stringify(newUser))
      if (tokenData) {
        localStorage.setItem("token", tokenData)
      }
      return newUser
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <UserContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</UserContext.Provider>
  )
}

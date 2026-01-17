import axios from "axios"
import { toast } from "../utils/toast"

const BASE = import.meta.env.VITE_SERVER_URL || "https://minorproject-f357e7db5e1f.herokuapp.com/"

const api = axios.create({ baseURL: BASE + "/api" })

api.interceptors.response.use(
  (response) => {
    if (response.data.user && !response.data.user._id) {
      response.data.user._id = response.data.user.id
    }
    return response
  },
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || "An error occurred"
    toast.error(errorMsg)
    return Promise.reject(error)
  },
)

export const register = (payload) =>
  api.post("/auth/register", payload).then((r) => {
    toast.success("Registration successful! Please log in.")
    return r.data
  })

export const login = (payload) =>
  api.post("/auth/login", payload).then((r) => {
    toast.success("Logged in successfully!")
    return r.data
  })

export const createRoom = (user, mode = "one-to-one", maxUsers = 2, language = "javascript") => {
  if (!user || !user._id) {
    toast.error("User not authenticated. Please login first.")
    return Promise.reject(new Error("User not authenticated"))
  }
  return api.post("/rooms/create", { user, mode, maxUsers, language }).then((r) => {
    toast.success("Room created successfully!")
    return r.data
  })
}

export const getRoom = (roomId, user) => {
  if (!user || !user._id) {
    toast.error("User not authenticated")
    return Promise.reject(new Error("User not authenticated"))
  }
  return api.post(`/rooms/${roomId}/join`, { user }).then((r) => {
    toast.success("Joined room!")
    return r.data
  })
}

export const executeCode = (payload) => api.post("/execute", payload).then((r) => r.data)

import axios from "axios"

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

// Adiciona o token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pdv-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se receber 401, desloga
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pdv-token")
      localStorage.removeItem("pdv-user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
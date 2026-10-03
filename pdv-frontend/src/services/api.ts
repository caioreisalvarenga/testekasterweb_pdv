import axios from "axios"

/**
 * URL base da API Laravel.
 * Pode ser sobrescrita via variável de ambiente VITE_API_URL.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
})

// ─── Interceptor de requisição ────────────────────────────
// Adiciona o token em toda chamada autenticada.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pdv-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Interceptor de resposta ──────────────────────────────
// Se a API responder 401, o token expirou → desloga.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pdv-token")
      localStorage.removeItem("pdv-user")
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

// ─── Helper de erro ───────────────────────────────────────
// Extrai a mensagem de erro do Laravel de forma amigável.
export function extrairMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    // Erro de validação (422): pega o primeiro campo com erro
    if (data?.errors && typeof data.errors === "object") {
      const primeiroCampo = Object.keys(data.errors)[0]
      return data.errors[primeiroCampo]?.[0] || "Erro de validação."
    }

    // Erro genérico com mensagem
    if (data?.message) return data.message

    // Erro de rede
    if (error.code === "ECONNABORTED") return "Tempo esgotado. Verifique a conexão."
    if (!error.response) return "Não foi possível conectar ao servidor."
  }

  return "Erro inesperado."
}
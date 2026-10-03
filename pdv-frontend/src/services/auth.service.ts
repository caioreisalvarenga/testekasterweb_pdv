import { api } from "@/services/api"

export type LoginResponse = {
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export type Usuario = {
  id: number
  name: string
  email: string
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/login", {
      email,
      password,
    })
    return data
  },

  async me(): Promise<Usuario> {
    const { data } = await api.get<Usuario>("/me")
    return data
  },

  async logout(): Promise<void> {
    await api.post("/logout")
  },
}
import { api } from "@/services/api"
import type { Produto, ProdutoForm } from "@/types/produto"

export const produtosService = {
  async listar(busca?: string): Promise<Produto[]> {
    const { data } = await api.get<Produto[]>("/produtos", {
      params: { busca: busca || undefined },
    })
    return data.map((p) => ({ ...p, preco: Number(p.preco) }))
  },

  async listarDisponiveis(busca?: string): Promise<Produto[]> {
    const { data } = await api.get<Produto[]>("/produtos", {
      params: { busca: busca || undefined, disponiveis: 1 },
    })
    return data.map((p) => ({ ...p, preco: Number(p.preco) }))
  },

  async criar(dados: ProdutoForm): Promise<Produto> {
    const { data } = await api.post<Produto>("/produtos", dados)
    return { ...data, preco: Number(data.preco) }
  },

  async atualizar(id: number, dados: ProdutoForm): Promise<Produto> {
    const { data } = await api.put<Produto>(`/produtos/${id}`, dados)
    return { ...data, preco: Number(data.preco) }
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`)
  },
}
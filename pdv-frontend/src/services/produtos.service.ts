import { api } from "@/services/api"
import { produtosMock } from "@/mocks/produtos"
import type { Produto, ProdutoForm } from "@/types/produto"

/**
 * ⚙️ Configuração: USE_MOCK
 * true  → usa dados fixos (mocks)
 * false → chama a API real (Laravel)
 */
const USE_MOCK = true

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms))
}

export const produtosService = {
  async listar(busca?: string): Promise<Produto[]> {
    if (USE_MOCK) {
      await delay()
      const termo = (busca || "").toLowerCase()
      if (!termo) return produtosMock
      return produtosMock.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.codigo.toLowerCase().includes(termo)
      )
    }

    const { data } = await api.get<Produto[]>("/produtos", {
      params: { busca: busca || undefined },
    })
    return data.map((p) => ({ ...p, preco: Number(p.preco) }))
  },

  async listarDisponiveis(busca?: string): Promise<Produto[]> {
    if (USE_MOCK) {
      await delay()
      const termo = (busca || "").toLowerCase()
      return produtosMock.filter(
        (p) =>
          p.disponivel &&
          (!termo ||
            p.nome.toLowerCase().includes(termo) ||
            p.codigo.toLowerCase().includes(termo))
      )
    }

    const { data } = await api.get<Produto[]>("/produtos", {
      params: { busca: busca || undefined, disponiveis: 1 },
    })
    return data.map((p) => ({ ...p, preco: Number(p.preco) }))
  },

  async criar(dados: ProdutoForm): Promise<Produto> {
    if (USE_MOCK) {
      await delay()
      const novo: Produto = { id: Date.now(), ...dados }
      produtosMock.push(novo)
      return novo
    }

    const { data } = await api.post<Produto>("/produtos", dados)
    return { ...data, preco: Number(data.preco) }
  },

  async atualizar(id: number, dados: ProdutoForm): Promise<Produto> {
    if (USE_MOCK) {
      await delay()
      const idx = produtosMock.findIndex((p) => p.id === id)
      if (idx < 0) throw new Error("Produto não encontrado")
      produtosMock[idx] = { ...produtosMock[idx], ...dados }
      return produtosMock[idx]
    }

    const { data } = await api.put<Produto>(`/produtos/${id}`, dados)
    return { ...data, preco: Number(data.preco) }
  },

  async excluir(id: number): Promise<void> {
    if (USE_MOCK) {
      await delay()
      const idx = produtosMock.findIndex((p) => p.id === id)
      if (idx >= 0) produtosMock.splice(idx, 1)
      return
    }

    await api.delete(`/produtos/${id}`)
  },
}
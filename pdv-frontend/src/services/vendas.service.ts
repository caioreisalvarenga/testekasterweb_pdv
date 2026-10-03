import { api } from "@/services/api"
import { vendasMock } from "@/mocks/vendas"
import { produtosMock } from "@/mocks/produtos"
import type { NovaVenda, Venda } from "@/types/venda"

const USE_MOCK = true

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms))
}

export const vendasService = {
  async listar(data?: string): Promise<Venda[]> {
    if (USE_MOCK) {
      await delay()
      return [...vendasMock]
    }
    const { data: vendas } = await api.get<Venda[]>("/vendas", {
      params: { data: data || undefined },
    })
    return vendas
  },

  async buscar(id: number): Promise<Venda> {
    if (USE_MOCK) {
      await delay()
      const venda = vendasMock.find((v) => v.id === id)
      if (!venda) throw new Error("Venda não encontrada")
      return venda
    }
    const { data } = await api.get<Venda>(`/vendas/${id}`)
    return data
  },

  async criar(dados: NovaVenda): Promise<Venda> {
    if (USE_MOCK) {
      await delay(500)

      let total = 0
      const itens = dados.itens.map((i, idx) => {
        const produto = produtosMock.find((p) => p.id === i.produto_id)
        const preco = produto?.preco ?? 0
        const subtotal = preco * i.quantidade
        total += subtotal
        return {
          id: idx + 1,
          produto_id: i.produto_id,
          produto_nome: produto?.nome ?? "Produto",
          quantidade: i.quantidade,
          preco_unitario: preco,
          subtotal,
        }
      })

      total = Math.round(total * 100) / 100

      const troco =
        dados.forma_pagamento === "dinheiro" && dados.valor_recebido
          ? Math.round((dados.valor_recebido - total) * 100) / 100
          : null

      const nova: Venda = {
        id: Math.max(0, ...vendasMock.map((v) => v.id)) + 1,
        total,
        forma_pagamento: dados.forma_pagamento,
        valor_recebido: dados.valor_recebido ?? null,
        troco,
        status: "finalizada",
        created_at: new Date().toISOString(),
        operador_nome: "Operador PDV",
        itens,
      }

      vendasMock.unshift(nova)
      return nova
    }

    const { data } = await api.post<Venda>("/vendas", dados)
    return data
  },
}
import { api } from "@/services/api"
import type { NovaVenda, Venda } from "@/types/venda"

export const vendasService = {
  async listar(data?: string): Promise<Venda[]> {
    const { data: vendas } = await api.get<any[]>("/vendas", {
      params: { data: data || undefined },
    })

    return vendas.map((v) => ({
      ...v,
      total: Number(v.total),
      valor_recebido: v.valor_recebido !== null ? Number(v.valor_recebido) : null,
      troco: v.troco !== null ? Number(v.troco) : null,
      itens: (v.itens ?? []).map((i: any) => ({
        id: i.id,
        produto_id: i.produto_id,
        produto_nome: i.produto?.nome ?? "Produto",
        quantidade: i.quantidade,
        preco_unitario: Number(i.preco_unitario),
        subtotal: Number(i.subtotal),
      })),
      operador_nome: v.user?.name ?? "Operador",
    }))
  },

  async buscar(id: number): Promise<Venda> {
    const { data } = await api.get<any>(`/vendas/${id}`)
    return {
      ...data,
      total: Number(data.total),
      valor_recebido:
        data.valor_recebido !== null ? Number(data.valor_recebido) : null,
      troco: data.troco !== null ? Number(data.troco) : null,
      itens: (data.itens ?? []).map((i: any) => ({
        id: i.id,
        produto_id: i.produto_id,
        produto_nome: i.produto?.nome ?? "Produto",
        quantidade: i.quantidade,
        preco_unitario: Number(i.preco_unitario),
        subtotal: Number(i.subtotal),
      })),
      operador_nome: data.user?.name ?? "Operador",
    }
  },

  async criar(dados: NovaVenda): Promise<Venda> {
    const { data } = await api.post<any>("/vendas", dados)

    return {
      ...data,
      total: Number(data.total),
      valor_recebido:
        data.valor_recebido !== null ? Number(data.valor_recebido) : null,
      troco: data.troco !== null ? Number(data.troco) : null,
      itens: (data.itens ?? []).map((i: any) => ({
        id: i.id,
        produto_id: i.produto_id,
        produto_nome: i.produto?.nome ?? "Produto",
        quantidade: i.quantidade,
        preco_unitario: Number(i.preco_unitario),
        subtotal: Number(i.subtotal),
      })),
      operador_nome: data.user?.name ?? "Operador",
    }
  },
}
export type FormaPagamento =
  | "dinheiro"
  | "cartao_credito"
  | "cartao_debito"
  | "pix"

export type VendaItem = {
  id: number
  produto_id: number
  produto_nome: string
  quantidade: number
  preco_unitario: number
  subtotal: number
}

export type Venda = {
  id: number
  total: number
  forma_pagamento: FormaPagamento
  valor_recebido: number | null
  troco: number | null
  status: "finalizada"
  created_at: string
  operador_nome: string
  itens: VendaItem[]
}

export type NovoItemVenda = {
  produto_id: number
  quantidade: number
}

export type NovaVenda = {
  forma_pagamento: FormaPagamento
  valor_recebido?: number
  itens: NovoItemVenda[]
}
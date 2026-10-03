import type { Venda } from "@/types/venda"

function hoje(offsetHours = 0): string {
  const d = new Date()
  d.setHours(d.getHours() - offsetHours)
  return d.toISOString()
}

export const vendasMock: Venda[] = [
  {
    id: 3,
    total: 21.5,
    forma_pagamento: "dinheiro",
    valor_recebido: 50,
    troco: 28.5,
    status: "finalizada",
    created_at: hoje(1),
    operador_nome: "Operador PDV",
    itens: [
      { id: 5, produto_id: 1, produto_nome: "Coca-Cola 350ml", quantidade: 2, preco_unitario: 5.5, subtotal: 11 },
      { id: 6, produto_id: 4, produto_nome: "Cerveja Heineken", quantidade: 1, preco_unitario: 12.9, subtotal: 12.9 },
    ],
  },
  {
    id: 2,
    total: 16.5,
    forma_pagamento: "pix",
    valor_recebido: null,
    troco: null,
    status: "finalizada",
    created_at: hoje(2),
    operador_nome: "Operador PDV",
    itens: [
      { id: 3, produto_id: 5, produto_nome: "Salgado Assado", quantidade: 1, preco_unitario: 8, subtotal: 8 },
      { id: 4, produto_id: 6, produto_nome: "Pão de Queijo", quantidade: 1, preco_unitario: 4.5, subtotal: 4.5 },
    ],
  },
  {
    id: 1,
    total: 15.0,
    forma_pagamento: "cartao_credito",
    valor_recebido: null,
    troco: null,
    status: "finalizada",
    created_at: hoje(3),
    operador_nome: "Operador PDV",
    itens: [
      { id: 1, produto_id: 2, produto_nome: "Pepsi 350ml", quantidade: 2, preco_unitario: 5, subtotal: 10 },
      { id: 2, produto_id: 8, produto_nome: "Bala de Hortelã", quantidade: 1, preco_unitario: 1.5, subtotal: 1.5 },
    ],
  },
]
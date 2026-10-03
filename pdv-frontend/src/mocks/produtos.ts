import type { Produto } from "@/types/produto"

export const produtosMock: Produto[] = [
  { id: 1,  nome: "Coca-Cola 350ml",         codigo: "REF001", preco: 5.5,  disponivel: true,  estoque: 50 },
  { id: 2,  nome: "Pepsi 350ml",             codigo: "REF002", preco: 5.0,  disponivel: true,  estoque: 40 },
  { id: 3,  nome: "Água Mineral 500ml",      codigo: "AGU001", preco: 3.0,  disponivel: true,  estoque: 100 },
  { id: 4,  nome: "Cerveja Heineken",        codigo: "CER001", preco: 12.9, disponivel: true,  estoque: 30 },
  { id: 5,  nome: "Salgado Assado",          codigo: "SAL001", preco: 8.0,  disponivel: true,  estoque: 20 },
  { id: 6,  nome: "Pão de Queijo",           codigo: "SAL002", preco: 4.5,  disponivel: true,  estoque: 25 },
  { id: 7,  nome: "Chocolate Barra",         codigo: "DOC001", preco: 6.5,  disponivel: true,  estoque: 60 },
  { id: 8,  nome: "Bala de Hortelã",         codigo: "DOC002", preco: 1.5,  disponivel: true,  estoque: 200 },
  { id: 9,  nome: "Café Expresso",           codigo: "CAF001", preco: 7.0,  disponivel: true,  estoque: 0 },
  { id: 10, nome: "Suco de Laranja",         codigo: "SUC001", preco: 9.9,  disponivel: true,  estoque: 15 },
  { id: 11, nome: "Produto Descontinuado",   codigo: "OFF001", preco: 10.0, disponivel: false, estoque: 0 },
]
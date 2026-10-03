export type Produto = {
  id: number
  nome: string
  codigo: string
  preco: number
  disponivel: boolean
  estoque: number
}

export type ProdutoForm = Omit<Produto, "id">
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Minus, Trash2, CreditCard, ShoppingCart } from "lucide-react"

type CartItem = {
  id: number
  nome: string
  preco: number
  quantidade: number
}

const produtosExemplo = [
  { id: 1, nome: "Coca-Cola 350ml", codigo: "REF001", preco: 5.5 },
  { id: 2, nome: "Pepsi 350ml", codigo: "REF002", preco: 5.0 },
  { id: 3, nome: "Água Mineral 500ml", codigo: "AGU001", preco: 3.0 },
  { id: 4, nome: "Cerveja Heineken", codigo: "CER001", preco: 12.9 },
  { id: 5, nome: "Salgado Assado", codigo: "SAL001", preco: 8.0 },
  { id: 6, nome: "Pão de Queijo", codigo: "SAL002", preco: 4.5 },
]

export function PdvPage() {
  const [busca, setBusca] = useState("")
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, nome: "Coca-Cola 350ml", preco: 5.5, quantidade: 2 },
  ])

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0)

  function addToCart(produto: typeof produtosExemplo[0]) {
    setCart((prev) => {
      const existe = prev.find((i) => i.id === produto.id)
      if (existe) {
        return prev.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantidade: Math.max(0, i.quantidade + delta) } : i
        )
        .filter((i) => i.quantidade > 0)
    )
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const produtosFiltrados = produtosExemplo.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Coluna esquerda: produtos */}
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold">Frente de Caixa</h1>
          <p className="text-sm text-muted-foreground">
            Busque produtos e adicione ao carrinho
          </p>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {produtosFiltrados.map((produto) => (
            <button
              key={produto.id}
              onClick={() => addToCart(produto)}
              className="text-left rounded-xl border bg-card p-4 hover:border-primary hover:shadow-md transition-all active:scale-95"
            >
              <div className="aspect-square rounded-lg bg-primary/10 mb-3 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-sm line-clamp-2">{produto.nome}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {produto.codigo}
              </p>
              <p className="text-lg font-bold text-primary mt-2">
                R$ {produto.preco.toFixed(2)}
              </p>
            </button>
          ))}
        </div>

        {produtosFiltrados.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum produto encontrado
          </div>
        )}
      </div>

      {/* Coluna direita: carrinho */}
      <aside className="w-96 border-l bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {cart.length} {cart.length === 1 ? "item" : "itens"}
            </span>
          </h2>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Carrinho vazio
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="rounded-lg border bg-background p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.nome}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      R$ {item.preco.toFixed(2)} un
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQty(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center font-medium text-sm">
                      {item.quantidade}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQty(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-sm">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com total e botão */}
        <div className="border-t p-4 space-y-3 bg-muted/30">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full h-12 text-base font-semibold"
            disabled={cart.length === 0}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Finalizar venda
          </Button>
        </div>
      </aside>
    </div>
  )
}
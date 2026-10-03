import { useMemo, useState } from "react"
import { useProdutos } from "@/hooks/use-produtos"
import { useDebounce } from "@/hooks/use-debounce"
import { vendasService } from "@/services/vendas.service"
import { PaymentModal } from "@/components/payment-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ShoppingCart,
  Loader2,
  Package,
  CheckCircle2,
} from "lucide-react"
import type { Produto } from "@/types/produto"
import type { FormaPagamento, Venda } from "@/types/venda"

type CartItem = {
  produto: Produto
  quantidade: number
}

export function PdvPage() {
  const [busca, setBusca] = useState("")
  const buscaDebounced = useDebounce(busca, 300)
  const { produtos, loading, erro } = useProdutos(buscaDebounced, true)

  const [cart, setCart] = useState<CartItem[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [vendaFinalizada, setVendaFinalizada] = useState<Venda | null>(null)

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.produto.preco * i.quantidade, 0),
    [cart]
  )

  function addToCart(produto: Produto) {
    setCart((prev) => {
      const existe = prev.find((i) => i.produto.id === produto.id)
      if (existe) {
        return prev.map((i) =>
          i.produto.id === produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.produto.id === id
            ? { ...i, quantidade: Math.max(0, i.quantidade + delta) }
            : i
        )
        .filter((i) => i.quantidade > 0)
    )
  }

  function remover(id: number) {
    setCart((prev) => prev.filter((i) => i.produto.id !== id))
  }

  function limpar() {
    setCart([])
  }

  async function finalizarVenda(
    forma: FormaPagamento,
    valorRecebido?: number
  ) {
    const venda = await vendasService.criar({
      forma_pagamento: forma,
      valor_recebido: valorRecebido,
      itens: cart.map((i) => ({
        produto_id: i.produto.id,
        quantidade: i.quantidade,
      })),
    })

    setVendaFinalizada(venda)
    setModalAberto(false)
    setCart([])
  }

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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Carregando produtos...
          </div>
        )}

        {!loading && erro && (
          <div className="text-center py-12 text-destructive">{erro}</div>
        )}

        {!loading && !erro && produtos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            Nenhum produto encontrado
          </div>
        )}

        {!loading && !erro && produtos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {produtos.map((produto) => (
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
        )}
      </div>

      {/* Coluna direita: carrinho */}
      <aside className="w-96 border-l bg-card flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho
            <span className="text-sm font-normal text-muted-foreground">
              ({cart.length})
            </span>
          </h2>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={limpar}
            >
              Limpar
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Carrinho vazio
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.produto.id}
                className="rounded-lg border bg-background p-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.produto.nome}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      R$ {item.produto.preco.toFixed(2)} un
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => remover(item.produto.id)}
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
                      onClick={() => updateQty(item.produto.id, -1)}
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
                      onClick={() => updateQty(item.produto.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-sm">
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4 space-y-3 bg-muted/30">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full h-12 text-base font-semibold"
            disabled={cart.length === 0}
            onClick={() => setModalAberto(true)}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Finalizar venda
          </Button>
        </div>
      </aside>

      <PaymentModal
        aberto={modalAberto}
        total={total}
        onFechar={() => setModalAberto(false)}
        onConfirmar={finalizarVenda}
      />

      {/* Modal de sucesso */}
      {vendaFinalizada && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold">Venda finalizada!</h2>
              <p className="text-sm text-muted-foreground">
                Venda #{vendaFinalizada.id}
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">
                  R$ {vendaFinalizada.total.toFixed(2)}
                </span>
              </div>
              {vendaFinalizada.troco !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Troco</span>
                  <span className="font-bold text-emerald-500">
                    R$ {vendaFinalizada.troco.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => setVendaFinalizada(null)}
            >
              Nova venda
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
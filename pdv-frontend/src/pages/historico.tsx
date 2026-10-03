import { useEffect, useState } from "react"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  History,
  Loader2,
  Search,
  Eye,
  DollarSign,
  ShoppingCart,
} from "lucide-react"

type VendaItem = {
  id: number
  produto_id: number
  quantidade: number
  preco_unitario: string
  subtotal: string
  produto: { id: number; nome: string; codigo: string }
}

type Venda = {
  id: number
  total: string
  forma_pagamento: string
  valor_recebido: string | null
  troco: string | null
  status: string
  created_at: string
  user: { id: number; name: string }
  itens: VendaItem[]
}

const formaLabel: Record<string, string> = {
  dinheiro: "Dinheiro",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  pix: "PIX",
}

export function HistoricoPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [data, setData] = useState(() => {
    const hoje = new Date()
    return hoje.toISOString().split("T")[0]
  })
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null)

  async function carregar(dataAtual = data) {
    setLoading(true)
    setErro("")
    try {
      const { data: resposta } = await api.get<Venda[]>("/vendas", {
        params: { data: dataAtual },
      })
      setVendas(resposta)
    } catch {
      setErro("Erro ao carregar histórico.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalDia = vendas.reduce((sum, v) => sum + Number(v.total), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
          <p className="text-muted-foreground mt-1">
            Vendas finalizadas no dia selecionado
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-auto"
          />
          <Button onClick={() => carregar()} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total do dia
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalDia.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas realizadas
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendas.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Estados */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando histórico...
        </div>
      )}

      {!loading && erro && (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            {erro}
          </CardContent>
        </Card>
      )}

      {!loading && !erro && vendas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            Nenhuma venda encontrada nesta data
          </CardContent>
        </Card>
      )}

      {/* Lista de vendas */}
      {!loading && !erro && vendas.length > 0 && (
        <div className="space-y-3">
          {vendas.map((venda) => (
            <Card key={venda.id}>
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    #{venda.id}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {formaLabel[venda.forma_pagamento] ||
                        venda.forma_pagamento}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(venda.created_at).toLocaleString("pt-BR")} ·{" "}
                      {venda.itens.length} item
                      {venda.itens.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      R$ {Number(venda.total).toFixed(2)}
                    </p>
                    {venda.troco && (
                      <p className="text-xs text-muted-foreground">
                        Troco: R$ {Number(venda.troco).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setVendaSelecionada(venda)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      <Dialog
        open={!!vendaSelecionada}
        onOpenChange={(open) => !open && setVendaSelecionada(null)}
      >
        <DialogContent className="max-w-2xl">
          {vendaSelecionada && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Venda #{vendaSelecionada.id}
                </DialogTitle>
                <DialogDescription>
                  {new Date(vendaSelecionada.created_at).toLocaleString("pt-BR")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Itens */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Itens</p>
                  <div className="space-y-2">
                    {vendaSelecionada.itens.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {item.produto?.nome || `Produto #${item.produto_id}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantidade} × R${" "}
                            {Number(item.preco_unitario).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          R$ {Number(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo */}
                <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Forma de pagamento</span>
                    <span className="font-medium">
                      {formaLabel[vendaSelecionada.forma_pagamento] ||
                        vendaSelecionada.forma_pagamento}
                    </span>
                  </div>

                  {vendaSelecionada.valor_recebido && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor recebido</span>
                      <span className="font-medium">
                        R$ {Number(vendaSelecionada.valor_recebido).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {vendaSelecionada.troco && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Troco</span>
                      <span className="font-medium">
                        R$ {Number(vendaSelecionada.troco).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {Number(vendaSelecionada.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
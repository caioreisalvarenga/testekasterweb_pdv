import { useState } from "react"
import { useVendas } from "@/hooks/use-vendas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  History,
  Loader2,
  Search,
  Eye,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import type { Venda } from "@/types/venda"

const formaLabel: Record<string, string> = {
  dinheiro: "Dinheiro",
  cartao_credito: "Crédito",
  cartao_debito: "Débito",
  pix: "PIX",
}

export function HistoricoPage() {
  const [data, setData] = useState(() =>
    new Date().toISOString().split("T")[0]
  )
  const [dataAplicada, setDataAplicada] = useState(data)
  const { vendas, loading, erro } = useVendas(dataAplicada)
  const [selecionada, setSelecionada] = useState<Venda | null>(null)

  const totalDia = vendas.reduce((s, v) => s + v.total, 0)

  return (
    <div className="p-6 space-y-6">
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
          <Button variant="outline" onClick={() => setDataAplicada(data)}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

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
            <div className="text-2xl font-bold">R$ {totalDia.toFixed(2)}</div>
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

      {!loading && !erro && vendas.length > 0 && (
        <div className="space-y-3">
          {vendas.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    #{v.id}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {formaLabel[v.forma_pagamento] || v.forma_pagamento}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(v.created_at).toLocaleString("pt-BR")} ·{" "}
                      {v.itens.length} item
                      {v.itens.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      R$ {v.total.toFixed(2)}
                    </p>
                    {v.troco !== null && (
                      <p className="text-xs text-muted-foreground">
                        Troco: R$ {v.troco.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelecionada(v)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selecionada}
        onOpenChange={(o) => !o && setSelecionada(null)}
      >
        <DialogContent className="max-w-2xl">
          {selecionada && (
            <>
              <DialogHeader>
                <DialogTitle>Venda #{selecionada.id}</DialogTitle>
                <DialogDescription>
                  {new Date(selecionada.created_at).toLocaleString("pt-BR")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Itens</p>
                  {selecionada.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {item.produto_nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantidade} × R${" "}
                          {item.preco_unitario.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        R$ {item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Forma de pagamento
                    </span>
                    <span className="font-medium">
                      {formaLabel[selecionada.forma_pagamento] ||
                        selecionada.forma_pagamento}
                    </span>
                  </div>

                  {selecionada.valor_recebido !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Valor recebido
                      </span>
                      <span className="font-medium">
                        R$ {selecionada.valor_recebido.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {selecionada.troco !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Troco</span>
                      <span className="font-medium text-emerald-500">
                        R$ {selecionada.troco.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {selecionada.total.toFixed(2)}
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
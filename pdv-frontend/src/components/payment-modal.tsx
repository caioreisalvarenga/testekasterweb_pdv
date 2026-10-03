import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Banknote, CreditCard, QrCode } from "lucide-react"
import type { FormaPagamento } from "@/types/venda"
import { cn } from "@/lib/utils"

type Props = {
  aberto: boolean
  total: number
  onFechar: () => void
  onConfirmar: (forma: FormaPagamento, valorRecebido?: number) => Promise<void>
}

const formas: { valor: FormaPagamento; label: string; icone: any }[] = [
  { valor: "dinheiro", label: "Dinheiro", icone: Banknote },
  { valor: "cartao_credito", label: "Crédito", icone: CreditCard },
  { valor: "cartao_debito", label: "Débito", icone: CreditCard },
  { valor: "pix", label: "PIX", icone: QrCode },
]

export function PaymentModal({ aberto, total, onFechar, onConfirmar }: Props) {
  const [forma, setForma] = useState<FormaPagamento>("dinheiro")
  const [valorRecebido, setValorRecebido] = useState("")
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState("")

  const valorNumerico = Number(valorRecebido.replace(",", ".")) || 0
  const troco = valorNumerico - total
  const trocoValido = troco >= 0

  const podeConfirmar =
    forma !== "dinheiro" || (valorRecebido !== "" && trocoValido)

  async function confirmar() {
    setProcessando(true)
    setErro("")
    try {
      await onConfirmar(
        forma,
        forma === "dinheiro" ? valorNumerico : undefined
      )
    } catch (e: any) {
      setErro(e.message || "Erro ao finalizar venda.")
    } finally {
      setProcessando(false)
    }
  }

  function resetar() {
    setForma("dinheiro")
    setValorRecebido("")
    setErro("")
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(o) => {
        if (!o) {
          resetar()
          onFechar()
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Finalizar venda</DialogTitle>
          <DialogDescription>
            Total a pagar:{" "}
            <span className="font-bold text-primary text-base">
              R$ {total.toFixed(2)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Forma de pagamento */}
          <div className="space-y-2">
            <Label>Forma de pagamento</Label>
            <div className="grid grid-cols-4 gap-2">
              {formas.map((f) => (
                <button
                  key={f.valor}
                  type="button"
                  onClick={() => setForma(f.valor)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                    forma === f.valor
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <f.icone className="h-5 w-5" />
                  <span className="text-xs font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Valor recebido (dinheiro) */}
          {forma === "dinheiro" && (
            <div className="space-y-2">
              <Label htmlFor="valor">Valor recebido</Label>
              <Input
                id="valor"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={valorRecebido}
                onChange={(e) => setValorRecebido(e.target.value)}
                className="h-12 text-lg font-semibold"
              />

              {valorRecebido && (
                <div
                  className={cn(
                    "rounded-lg p-3 text-sm flex justify-between items-center",
                    trocoValido
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  )}
                >
                  <span className="font-medium">
                    {trocoValido ? "Troco" : "Falta"}
                  </span>
                  <span className="font-bold text-base">
                    R$ {Math.abs(troco).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {erro && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {erro}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onFechar} disabled={processando}>
            Cancelar
          </Button>
          <Button
            onClick={confirmar}
            disabled={!podeConfirmar || processando}
            className="min-w-32"
          >
            {processando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
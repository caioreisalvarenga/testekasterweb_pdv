import { useState } from "react"
import { useProdutos } from "@/hooks/use-produtos"
import { useDebounce } from "@/hooks/use-debounce"
import { produtosService } from "@/services/produtos.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react"
import type { Produto, ProdutoForm } from "@/types/produto"

const formVazio: ProdutoForm = {
  nome: "",
  codigo: "",
  preco: 0,
  disponivel: true,
  estoque: 0,
}

export function ProdutosPage() {
  const [busca, setBusca] = useState("")
  const buscaDebounced = useDebounce(busca, 400)
  const { produtos, loading, erro, recarregar } = useProdutos(buscaDebounced)

  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Produto | null>(null)
  const [form, setForm] = useState<ProdutoForm>(formVazio)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState("")

  function abrirNovo() {
    setEditando(null)
    setForm(formVazio)
    setErroForm("")
    setModal(true)
  }

  function abrirEdicao(p: Produto) {
    setEditando(p)
    setForm({
      nome: p.nome,
      codigo: p.codigo,
      preco: p.preco,
      disponivel: p.disponivel,
      estoque: p.estoque,
    })
    setErroForm("")
    setModal(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErroForm("")
    try {
      if (editando) {
        await produtosService.atualizar(editando.id, form)
      } else {
        await produtosService.criar(form)
      }
      setModal(false)
      recarregar()
    } catch (err: any) {
      setErroForm(err.message || "Erro ao salvar.")
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(p: Produto) {
    if (!confirm(`Excluir "${p.nome}"?`)) return
    await produtosService.excluir(p.id)
    recarregar()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo produto
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando produtos...
        </div>
      )}

      {!loading && erro && (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            {erro}
          </CardContent>
        </Card>
      )}

      {!loading && !erro && produtos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            Nenhum produto encontrado
          </CardContent>
        </Card>
      )}

      {!loading && !erro && produtos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.nome}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Código: {p.codigo}
                    </p>
                  </div>
                  <Badge variant={p.disponivel ? "success" : "destructive"}>
                    {p.disponivel ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      R$ {p.preco.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estoque: {p.estoque}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirEdicao(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => excluir(p)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editando ? "Editar produto" : "Novo produto"}
            </DialogTitle>
            <DialogDescription>
              {editando
                ? "Atualize as informações."
                : "Preencha os dados."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.preco}
                  onChange={(e) =>
                    setForm({ ...form, preco: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={form.estoque}
                  onChange={(e) =>
                    setForm({ ...form, estoque: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="disponivel"
                type="checkbox"
                checked={form.disponivel}
                onChange={(e) =>
                  setForm({ ...form, disponivel: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="disponivel">Disponível para venda</Label>
            </div>

            {erroForm && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {erroForm}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando}>
                {salvando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editando ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
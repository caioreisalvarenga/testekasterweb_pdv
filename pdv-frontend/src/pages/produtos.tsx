import { useEffect, useState } from "react"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  Loader2,
} from "lucide-react"

type Produto = {
  id: number
  nome: string
  codigo: string
  preco: string
  disponivel: boolean
  estoque: number
}

type FormProduto = {
  nome: string
  codigo: string
  preco: string
  disponivel: boolean
  estoque: number
}

const formVazio: FormProduto = {
  nome: "",
  codigo: "",
  preco: "",
  disponivel: true,
  estoque: 0,
}

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Produto | null>(null)
  const [form, setForm] = useState<FormProduto>(formVazio)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState("")

  // Carrega produtos
  async function carregar(buscaAtual = "") {
    setLoading(true)
    setErro("")
    try {
      const { data } = await api.get<Produto[]>("/produtos", {
        params: { busca: buscaAtual || undefined },
      })
      setProdutos(data)
    } catch (e) {
      setErro("Erro ao carregar produtos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  // Debounce da busca
  useEffect(() => {
    const t = setTimeout(() => carregar(busca), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca])

  function abrirNovo() {
    setEditando(null)
    setForm(formVazio)
    setErroForm("")
    setModalAberto(true)
  }

  function abrirEdicao(produto: Produto) {
    setEditando(produto)
    setForm({
      nome: produto.nome,
      codigo: produto.codigo,
      preco: produto.preco,
      disponivel: produto.disponivel,
      estoque: produto.estoque,
    })
    setErroForm("")
    setModalAberto(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErroForm("")

    try {
      const payload = {
        ...form,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
      }

      if (editando) {
        await api.put(`/produtos/${editando.id}`, payload)
      } else {
        await api.post("/produtos", payload)
      }

      setModalAberto(false)
      carregar(busca)
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Erro ao salvar. Verifique os campos."
      setErroForm(msg)
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(produto: Produto) {
    if (!confirm(`Excluir o produto "${produto.nome}"?`)) return

    try {
      await api.delete(`/produtos/${produto.id}`)
      carregar(busca)
    } catch {
      alert("Erro ao excluir produto.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
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

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Estados */}
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

      {/* Grid */}
      {!loading && !erro && produtos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map((produto) => (
            <Card key={produto.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{produto.nome}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Código: {produto.codigo}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      produto.disponivel
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {produto.disponivel ? "Disponível" : "Indisponível"}
                  </span>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      R$ {Number(produto.preco).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estoque: {produto.estoque}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirEdicao(produto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => excluir(produto)}
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

      {/* Modal de cadastro/edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editando ? "Editar produto" : "Novo produto"}
            </DialogTitle>
            <DialogDescription>
              {editando
                ? "Atualize as informações do produto."
                : "Preencha os dados do novo produto."}
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
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
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
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando}>
                {salvando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editando ? "Salvar alterações" : "Criar produto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
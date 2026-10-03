import { useCallback, useEffect, useState } from "react"
import { produtosService } from "@/services/produtos.service"
import type { Produto } from "@/types/produto"

export function useProdutos(busca: string, apenasDisponiveis = false) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro("")
    try {
      const data = apenasDisponiveis
        ? await produtosService.listarDisponiveis(busca)
        : await produtosService.listar(busca)
      setProdutos(data)
    } catch {
      setErro("Erro ao carregar produtos.")
    } finally {
      setLoading(false)
    }
  }, [busca, apenasDisponiveis])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { produtos, loading, erro, recarregar: carregar }
}
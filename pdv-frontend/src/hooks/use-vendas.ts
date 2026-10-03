import { useCallback, useEffect, useState } from "react"
import { vendasService } from "@/services/vendas.service"
import type { Venda } from "@/types/venda"

export function useVendas(data?: string) {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro("")
    try {
      setVendas(await vendasService.listar(data))
    } catch {
      setErro("Erro ao carregar vendas.")
    } finally {
      setLoading(false)
    }
  }, [data])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { vendas, loading, erro, recarregar: carregar }
}
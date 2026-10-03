import { useEffect, useState } from "react"

export function useDebounce<T>(valor: T, delay = 400): T {
  const [debounced, setDebounced] = useState(valor)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(valor), delay)
    return () => clearTimeout(t)
  }, [valor, delay])

  return debounced
}
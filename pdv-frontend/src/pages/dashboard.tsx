import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const metrics = [
  {
    title: "Vendas hoje",
    value: "R$ 1.842,50",
    change: "+12,5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Vendas do dia",
    value: "48",
    change: "+8,2%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "Ticket médio",
    value: "R$ 38,39",
    change: "-2,1%",
    trend: "down" as const,
    icon: TrendingUp,
  },
  {
    title: "Produtos ativos",
    value: "10",
    change: "+2",
    trend: "up" as const,
    icon: Package,
  },
]

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do movimento do dia
        </p>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <metric.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    metric.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {metric.change}
                </span>
                <span>vs ontem</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Áreas grandes */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Vendas nos últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {[45, 62, 38, 74, 58, 82, 68].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/40"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Top produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Coca-Cola 350ml", qty: 24 },
              { name: "Pão de Queijo", qty: 18 },
              { name: "Cerveja Heineken", qty: 12 },
              { name: "Chocolate Barra", qty: 9 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.qty} unidades
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
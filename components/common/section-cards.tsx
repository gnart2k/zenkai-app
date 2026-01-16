import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface SectionCardData {
  title: string
  value: string
  change: string
  changeType: "up" | "down"
  footerText: string
  footerSubtext: string
}

export interface SectionCardsProps {
  data: SectionCardData[]
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data.map((card) => {
        const TrendIcon = card.changeType === "up" ? IconTrendingUp : IconTrendingDown
        const isPositive = card.changeType === "up"
        const changeColor = isPositive ? "text-emerald-600" : "text-red-600"
        const gradientClass = isPositive 
          ? "bg-gradient-to-t from-emerald-100/10 to-white"
          : "bg-gradient-to-t from-red-100/10 to-white"
        
        return (
          <Card key={card.title} className={`@container/card ${gradientClass} border-slate-200`}>
            <CardHeader>
              <CardDescription className="text-muted-foreground">{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-slate-900 @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className={`${changeColor} border-slate-200 bg-white`}>
                  <TrendIcon className="size-4" />
                  <span className="ml-1 text-xs font-medium">{card.change}</span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium text-slate-600">
                {card.footerText}
              </div>
              <div className="text-muted-foreground">{card.footerSubtext}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

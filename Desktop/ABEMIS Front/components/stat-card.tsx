import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  className,
}: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card className={cn('border-border shadow-sm hover:shadow-md transition-shadow bg-card', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-card-foreground">{value}</div>
        {change && (
          <p className={cn('text-xs mt-1', changeColor[changeType])}>{change}</p>
        )}
      </CardContent>
    </Card>
  )
}

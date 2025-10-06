'use client'

import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  Activity,
  Target,
  Calendar,
  Users
} from 'lucide-react'

export default function AnalyticsPage() {
  const analyticsCards = [
    {
      title: 'Total Projects',
      value: 24,
      change: '+12% from last quarter',
      changeType: 'positive' as const,
      icon: BarChart3,
    },
    {
      title: 'Budget Utilization',
      value: '78%',
      change: '+5% from last month',
      changeType: 'positive' as const,
      icon: Target,
    },
    {
      title: 'Completion Rate',
      value: '85%',
      change: '+8% from last quarter',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      title: 'Active Users',
      value: 156,
      change: '+23 new this month',
      changeType: 'positive' as const,
      icon: Users,
    },
  ]

  const projectMetrics = [
    { label: 'Infrastructure Projects', value: 12, percentage: 40 },
    { label: 'FMR Projects', value: 8, percentage: 27 },
    { label: 'Machinery Projects', value: 6, percentage: 20 },
    { label: 'Research Projects', value: 4, percentage: 13 },
  ]

  const statusMetrics = [
    { label: 'Completed', value: 8, percentage: 33, color: 'bg-green-500' },
    { label: 'In Progress', value: 12, percentage: 50, color: 'bg-blue-500' },
    { label: 'Planning', value: 4, percentage: 17, color: 'bg-yellow-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Project performance and system insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Project Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of projects by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <span className="text-sm">{metric.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{metric.value}</span>
                    <Badge variant="secondary">{metric.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status Overview
            </CardTitle>
            <CardDescription>
              Current project status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {metric.value} projects ({metric.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.color}`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <CardDescription>
              Project completion over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect real charting library (Chart.js, Recharts, etc.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Budget Analysis
            </CardTitle>
            <CardDescription>
              Budget allocation and spending trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Budget analysis chart will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect real charting library for financial data visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Generate reports and export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

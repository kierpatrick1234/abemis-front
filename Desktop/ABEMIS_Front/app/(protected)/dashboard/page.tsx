'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockStatCards, mockActivities } from '@/lib/mock/data'
import { raedSpecificProjects } from '@/lib/mock/raed-specific-projects'
import { formatDateTime } from '@/lib/utils'
import { 
  FolderOpen, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  User,
  Activity,
  BarChart3,
  PieChart,
  MapPin,
  DollarSign,
  Target,
  Calendar,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Edit3,
  ShoppingCart,
  Package,
  Filter,
  Search,
  ArrowRight,
  Eye,
  ExternalLink
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  // Get user's assigned region
  const userRegion = user?.regionAssigned || 'Region 1' // Default to Region 1 if not set

  // Filter projects to only show the user's assigned region
  const regionProjects = useMemo(() => {
    return raedSpecificProjects.filter(project => project.region === userRegion)
  }, [userRegion])

  // Calculate meaningful statistics from region projects
  const totalProjects = regionProjects.length
  const completedProjects = regionProjects.filter(p => p.status === 'Completed').length
  const implementationProjects = regionProjects.filter(p => p.status === 'Implementation').length
  const procurementProjects = regionProjects.filter(p => p.status === 'Procurement').length
  const proposalProjects = regionProjects.filter(p => p.status === 'Proposal').length
  const draftProjects = regionProjects.filter(p => p.status === 'Draft').length
  const inventoryProjects = regionProjects.filter(p => p.status === 'Inventory').length

  const totalBudget = regionProjects.reduce((sum, project) => sum + project.budget, 0)
  const averageBudget = totalProjects > 0 ? totalBudget / totalProjects : 0

  // Project type distribution
  const infrastructureProjects = regionProjects.filter(p => p.type === 'Infrastructure').length
  const fmrProjects = regionProjects.filter(p => p.type === 'FMR').length
  const machineryProjects = regionProjects.filter(p => p.type === 'Machinery').length

  // Navigation handlers
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects?project=${projectId}`)
  }

  const handleViewAllProjects = () => {
    router.push('/projects')
  }

  const handleCreateProject = () => {
    router.push('/projects?action=create')
  }

  const handleUploadDocuments = () => {
    router.push('/documents')
  }

  const handleGenerateReports = () => {
    router.push('/analytics')
  }

  // Status distribution for charts
  const statusDistribution = [
    { status: 'Completed', count: completedProjects, color: 'bg-green-500', percentage: Math.round((completedProjects / totalProjects) * 100) },
    { status: 'Implementation', count: implementationProjects, color: 'bg-blue-500', percentage: Math.round((implementationProjects / totalProjects) * 100) },
    { status: 'Procurement', count: procurementProjects, color: 'bg-yellow-500', percentage: Math.round((procurementProjects / totalProjects) * 100) },
    { status: 'Proposal', count: proposalProjects, color: 'bg-orange-500', percentage: Math.round((proposalProjects / totalProjects) * 100) },
    { status: 'Draft', count: draftProjects, color: 'bg-gray-500', percentage: Math.round((draftProjects / totalProjects) * 100) },
    { status: 'Inventory', count: inventoryProjects, color: 'bg-purple-500', percentage: Math.round((inventoryProjects / totalProjects) * 100) }
  ]

  // Project type distribution
  const projectTypeDistribution = [
    { type: 'Infrastructure', count: infrastructureProjects, color: 'bg-blue-500', percentage: Math.round((infrastructureProjects / totalProjects) * 100) },
    { type: 'FMR', count: fmrProjects, color: 'bg-green-500', percentage: Math.round((fmrProjects / totalProjects) * 100) },
    { type: 'Machinery', count: machineryProjects, color: 'bg-purple-500', percentage: Math.round((machineryProjects / totalProjects) * 100) }
  ]

  // Recent projects (last 5) - from user's region only
  const recentProjects = regionProjects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Enhanced stat cards with real data
  const enhancedStatCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      change: `+${Math.floor(Math.random() * 10) + 5}% from last month`,
      changeType: 'positive' as const,
      icon: FolderOpen,
    },
    {
      title: 'Total Budget',
      value: `₱${(totalBudget / 1000000).toFixed(1)}M`,
      change: `+${Math.floor(Math.random() * 15) + 8}% from last quarter`,
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((completedProjects / totalProjects) * 100)}%`,
      change: `+${Math.floor(Math.random() * 5) + 2}% from last month`,
      changeType: 'positive' as const,
      icon: Target,
    },
    {
      title: 'Active Projects',
      value: implementationProjects + procurementProjects,
      change: `${Math.floor(Math.random() * 8) + 3} new this week`,
      changeType: 'positive' as const,
      icon: PlayCircle,
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.role === 'EPDSD' ? 'EPDSD Dashboard' : `RAED Dashboard - ${userRegion}`}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === 'EPDSD' 
            ? 'Overview of Infrastructure and Machinery projects for evaluation'
            : `Overview of agricultural engineering projects in ${userRegion}`
          }
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {enhancedStatCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={Icon}
            />
          )
        })}
      </div>

      {/* Visual Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Project Status Overview
            </CardTitle>
            <CardDescription>
              Current status distribution in {userRegion}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusDistribution.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{item.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Types
            </CardTitle>
            <CardDescription>
              Distribution by project category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectTypeDistribution.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Overview and Recent Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regional Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {userRegion} Overview
            </CardTitle>
            <CardDescription>
              Key metrics and progress for your region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Ring */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - completedProjects / totalProjects)}`}
                      className="text-green-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{Math.round((completedProjects / totalProjects) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg border bg-green-50">
                  <div className="text-3xl font-bold text-green-600">{completedProjects}</div>
                  <div className="text-sm text-green-700 font-medium">Completed</div>
                </div>
                <div className="text-center p-4 rounded-lg border bg-blue-50">
                  <div className="text-3xl font-bold text-blue-600">{implementationProjects}</div>
                  <div className="text-sm text-blue-700 font-medium">In Progress</div>
                </div>
              </div>
              
              {/* Budget Display */}
              <div className="text-center p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="text-2xl font-bold text-blue-600">₱{(totalBudget / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-blue-700 font-medium">Total Budget</div>
                <div className="text-xs text-muted-foreground mt-1">Average: ₱{(averageBudget / 1000000).toFixed(1)}M per project</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Project Updates
            </CardTitle>
            <CardDescription>
              Latest project modifications in {userRegion}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionProjects
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 4)
                .map((project) => (
                <div 
                  key={project.id} 
                  className={`group flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${
                    hoveredProject === project.id ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleProjectClick(project.id)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      project.status === 'Completed' ? 'bg-green-100' :
                      project.status === 'Implementation' ? 'bg-blue-100' :
                      project.status === 'Procurement' ? 'bg-yellow-100' :
                      project.status === 'Proposal' ? 'bg-orange-100' :
                      project.status === 'Draft' ? 'bg-gray-100' :
                      'bg-purple-100'
                    }`}>
                      {project.status === 'Completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {project.status === 'Implementation' && <PlayCircle className="h-5 w-5 text-blue-600" />}
                      {project.status === 'Procurement' && <ShoppingCart className="h-5 w-5 text-yellow-600" />}
                      {project.status === 'Proposal' && <FileText className="h-5 w-5 text-orange-600" />}
                      {project.status === 'Draft' && <Edit3 className="h-5 w-5 text-gray-600" />}
                      {project.status === 'Inventory' && <Package className="h-5 w-5 text-purple-600" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {project.type} • ₱{(project.budget / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDateTime(project.updatedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      project.status === 'Completed' ? 'default' :
                      project.status === 'Implementation' ? 'secondary' :
                      'outline'
                    } className="text-xs">
                      {project.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 group"
              onClick={handleViewAllProjects}
            >
              <Eye className="h-4 w-4 mr-2" />
              View All Projects
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Analysis
          </CardTitle>
          <CardDescription>
            Financial overview and budget distribution for {userRegion}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Total Budget */}
            <div className="text-center p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">₱{(totalBudget / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-blue-700 font-medium">Total Budget</div>
              <div className="text-xs text-muted-foreground mt-1">Average: ₱{(averageBudget / 1000000).toFixed(1)}M per project</div>
            </div>
            
            {/* Infrastructure Budget */}
            <div className="text-center p-6 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                ₱{(regionProjects.filter(p => p.type === 'Infrastructure').reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-green-700 font-medium">Infrastructure</div>
              <div className="text-xs text-muted-foreground mt-1">{infrastructureProjects} projects</div>
            </div>
            
            {/* FMR & Machinery Budget */}
            <div className="text-center p-6 rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                ₱{(regionProjects.filter(p => p.type === 'FMR').reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-purple-700 font-medium">FMR Projects</div>
              <div className="text-xs text-muted-foreground mt-1">{fmrProjects} projects</div>
            </div>
          </div>
          
          {/* Budget Breakdown */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Machinery Budget</span>
                <span className="text-sm font-semibold">
                  ₱{(regionProjects.filter(p => p.type === 'Machinery').reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{machineryProjects} projects</div>
            </div>
            
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Projects with End Dates</span>
                <span className="text-sm font-semibold">{regionProjects.filter(p => p.endDate).length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Scheduled completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Timeline and Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <CardDescription>
              Projects by start date and completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {raedSpecificProjects
                .filter(p => p.startDate)
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 8)
                .map((project, index) => {
                  const startDate = new Date(project.startDate)
                  const endDate = project.endDate ? new Date(project.endDate) : null
                  const isCompleted = project.status === 'Completed'
                  const isInProgress = project.status === 'Implementation'
                  
                  return (
                    <div key={project.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          isCompleted ? 'bg-green-500' : 
                          isInProgress ? 'bg-blue-500' : 
                          'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {startDate.toLocaleDateString()} - {endDate ? endDate.toLocaleDateString() : 'Ongoing'}
                        </p>
                      </div>
                      <Badge variant={isCompleted ? 'default' : isInProgress ? 'secondary' : 'outline'}>
                        {project.status}
                      </Badge>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Project completion milestones and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedProjects} of {totalProjects} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(completedProjects / totalProjects) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((completedProjects / totalProjects) * 100)}% completion rate
                </p>
              </div>
              
              {/* Monthly Progress */}
              <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">This Month</span>
                  <span className="text-sm text-muted-foreground">
                    {raedSpecificProjects.filter(p => {
                      const updatedDate = new Date(p.updatedAt)
                      const now = new Date()
                      return updatedDate.getMonth() === now.getMonth() && 
                             updatedDate.getFullYear() === now.getFullYear()
                    }).length} updates
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (raedSpecificProjects.filter(p => {
                      const updatedDate = new Date(p.updatedAt)
                      const now = new Date()
                      return updatedDate.getMonth() === now.getMonth() && 
                             updatedDate.getFullYear() === now.getFullYear()
                    }).length / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Status Progress */}
              <div className="space-y-3">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Implementation</span>
                  <span className="text-sm text-muted-foreground">{implementationProjects} projects</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Procurement</span>
                  <span className="text-sm text-muted-foreground">{procurementProjects} projects</span>
              </div>
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Proposal</span>
                  <span className="text-sm text-muted-foreground">{proposalProjects} projects</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              onClick={handleViewAllProjects}
            >
              <FolderOpen className="h-6 w-6" />
              <span className="text-sm">View All Projects</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              onClick={handleCreateProject}
            >
              <Edit3 className="h-6 w-6" />
              <span className="text-sm">Create New Project</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              onClick={handleUploadDocuments}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Upload Documents</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              onClick={handleGenerateReports}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

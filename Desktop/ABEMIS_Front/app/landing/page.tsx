'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, 
  BarChart3, 
  FileText, 
  Users, 
  MapPin, 
  TrendingUp,
  CheckCircle,
  Star,
  Globe,
  Smartphone,
  Download,
  Search,
  PieChart,
  Target,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { AbemisLogo } from '@/components/abemis-logo'
import { mockProjects } from '@/lib/mock/data'
import { Project } from '@/lib/types'

interface ProjectMilestone {
  name: string
  completed: boolean
  date: string
}

interface TrackingResult {
  id: string
  title: string
  status: string
  progress: number
  budget: number
  startDate: string
  expectedCompletion: string
  region: string
  type: string
  description: string
  milestones: ProjectMilestone[]
}

export default function LandingPage() {
  const router = useRouter()
  const [isLoginHovered, setIsLoginHovered] = useState(false)
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)

  const handleLoginClick = (buttonType = 'unknown') => {
    console.log(`${buttonType} button clicked!`) // Debug log
    console.log('Router object:', router) // Debug router
    try {
      console.log('Attempting to navigate to /login...')
      router.push('/login')
      console.log('Router.push called successfully')
    } catch (error) {
      console.error('Router push failed:', error)
      // Fallback to window location
      console.log('Using fallback navigation...')
      window.location.href = '/login'
    }
  }

  const generateMilestones = (project: Project): ProjectMilestone[] => {
    const milestones: ProjectMilestone[] = []
    const startDate = new Date(project.startDate)
    
    // Planning Phase - always completed
    milestones.push({
      name: 'Planning Phase',
      completed: true,
      date: project.startDate
    })
    
    // Procurement Phase
    const procurementDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days after start
    milestones.push({
      name: 'Procurement',
      completed: project.status === 'Implementation' || project.status === 'Completed',
      date: procurementDate.toISOString().split('T')[0]
    })
    
    // Implementation Phase
    const implementationDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000) // 60 days after start
    milestones.push({
      name: 'Implementation',
      completed: project.status === 'Completed',
      date: implementationDate.toISOString().split('T')[0]
    })
    
    // Final Inspection/Completion
    const completionDate = project.endDate || new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    milestones.push({
      name: 'Final Inspection',
      completed: project.status === 'Completed',
      date: completionDate
    })
    
    return milestones
  }

  const calculateProgress = (project: { status: string }): number => {
    switch (project.status) {
      case 'Proposal':
        return 10
      case 'Procurement':
        return 35
      case 'Implementation':
        return 75
      case 'Completed':
        return 100
      default:
        return 0
    }
  }

  const handleTrackingSearch = () => {
    // Find project in the real project data
    const project = mockProjects.find(p => p.id === trackingCode.toUpperCase())
    
    if (project) {
      const progress = calculateProgress(project)
      const milestones = generateMilestones(project)
      
      const trackingResult: TrackingResult = {
        id: project.id,
        title: project.title,
        status: project.status,
        progress: progress,
        budget: project.budget,
        startDate: project.startDate,
        expectedCompletion: project.endDate || new Date(new Date(project.startDate).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        region: project.region || project.province,
        type: project.type,
        description: project.description,
        milestones: milestones
      }
      
      setTrackingResult(trackingResult)
    } else {
      setTrackingResult(null)
    }
  }

  const downloadReport = (type: string) => {
    // Mock download functionality
    const reportData: Record<string, string> = {
      'quarterly': 'ABEMIS_Quarterly_Report_Q1_2024.pdf',
      'annual': 'ABEMIS_Annual_Report_2023.pdf',
      'projects': 'Active_Projects_Status_Report.pdf'
    }
    
    // In a real implementation, this would trigger a download
    const fileName = reportData[type] || 'Unknown_Report.pdf'
    alert(`Downloading ${fileName}...`)
  }

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Project Creation & Planning",
      description: "Streamlined project creation workflow for agricultural infrastructure projects and farm-to-market road initiatives."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Project Approval System",
      description: "Digital approval workflows for project proposals, budget allocations, and implementation authorizations."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Implementation Monitoring",
      description: "Real-time tracking of project progress, milestone achievements, and compliance monitoring."
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Farm-to-Market Road Management",
      description: "Specialized tools for planning, implementing, and maintaining farm-to-market road infrastructure."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Management",
      description: "Centralized storage and management of project documents, permits, and regulatory compliance files."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-Level Access Control",
      description: "Role-based access for Central Office staff, regional engineers, and authorized stakeholders."
    }
  ]

  const stats = [
    { label: "Active Projects", value: "150+", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Regional Coverage", value: "17 Regions", icon: <Globe className="h-5 w-5" /> },
    { label: "Authorized Users", value: "500+", icon: <Users className="h-5 w-5" /> },
    { label: "Farm-to-Market Roads", value: "2,500+ km", icon: <MapPin className="h-5 w-5" /> }
  ]

  // Enhanced statistics for charts
  const projectStats = {
    totalProjects: 247,
    activeProjects: 150,
    completedProjects: 85,
    totalBudget: 1855000000, // 1.855B PHP
    regionalDistribution: [
      { region: 'NCR', projects: 25, budget: 250000000 },
      { region: 'CAR', projects: 18, budget: 180000000 },
      { region: 'Region I', projects: 22, budget: 220000000 },
      { region: 'Region II', projects: 20, budget: 200000000 },
      { region: 'Region III', projects: 28, budget: 280000000 },
      { region: 'Region IV-A', projects: 30, budget: 300000000 },
      { region: 'Region IV-B', projects: 15, budget: 150000000 },
      { region: 'Region V', projects: 19, budget: 190000000 },
      { region: 'Region VI', projects: 24, budget: 240000000 },
      { region: 'Region VII', projects: 21, budget: 210000000 },
      { region: 'Region VIII', projects: 16, budget: 160000000 },
      { region: 'Region IX', projects: 14, budget: 140000000 },
      { region: 'Region X', projects: 17, budget: 170000000 },
      { region: 'Region XI', projects: 23, budget: 230000000 },
      { region: 'Region XII', projects: 12, budget: 120000000 },
      { region: 'Region XIII', projects: 13, budget: 130000000 },
      { region: 'BARMM', projects: 10, budget: 100000000 }
    ],
    projectTypes: [
      { type: 'Infrastructure', count: 98, percentage: 40 },
      { type: 'Farm-to-Market Roads', count: 89, percentage: 36 },
      { type: 'Machinery & Equipment', count: 35, percentage: 14 },
      { type: 'Research & Development', count: 25, percentage: 10 }
    ],
    statusDistribution: [
      { status: 'Completed', count: 85, percentage: 34, color: 'bg-green-500' },
      { status: 'Implementation', count: 95, percentage: 38, color: 'bg-blue-500' },
      { status: 'Procurement', count: 45, percentage: 18, color: 'bg-yellow-500' },
      { status: 'Planning', count: 22, percentage: 9, color: 'bg-gray-500' }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <AbemisLogo size="md" textSize="sm" />
            <Button 
              onClick={() => handleLoginClick('Top Navigation')}
              className="transition-all duration-200 transform hover:scale-105 relative z-10"
              type="button"
            >
              Login
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Agricultural & Biosystems Engineering
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  {" "}Management Information System
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                ABEMIS 3.0 is the official information system of the Department of Agriculture - 
                Bureau of Agricultural and Fisheries Engineering (DA-BAFE) Central Office, 
                designed to manage agricultural infrastructure projects, farm-to-market roads, 
                and engineering initiatives across the Philippines.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={() => handleLoginClick('Access System')}
                size="lg" 
                className="transition-all duration-200 transform hover:scale-105"
                type="button"
              >
                Access System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
              >
                System Overview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Tracking Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Track Your Project
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Enter your project tracking code to view real-time status, progress, and milestones.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Search className="h-6 w-6" />
                  Project Status Tracker
                </CardTitle>
                <CardDescription>
                  Enter your project code to view detailed information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder={`Enter project tracking reference (e.g., ${mockProjects[0]?.id || 'PRJ-001'})`}
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleTrackingSearch} className="px-8">
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
                
                {trackingResult && (
                  <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{trackingResult.title}</h3>
                      <p className="text-sm text-muted-foreground">{trackingResult.region}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant={trackingResult.status === 'Completed' ? 'default' : 'secondary'}>
                          {trackingResult.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-semibold">₱{trackingResult.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${trackingResult.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{trackingResult.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Project Milestones</h4>
                      <div className="space-y-2">
                        {trackingResult.milestones.map((milestone, index) => {
                          const milestoneDate = new Date(milestone.date)
                          const now = new Date()
                          const daysAgo = Math.floor((now.getTime() - milestoneDate.getTime()) / (1000 * 60 * 60 * 24))
                          
                          return (
                            <div key={index} className="flex items-center gap-3">
                              {milestone.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div className="flex-1">
                                <span className={milestone.completed ? 'text-green-700' : 'text-muted-foreground'}>
                                  {milestone.name}
                                </span>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    {milestone.date}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {daysAgo > 0 ? `${daysAgo} days ago` : 'Today'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {trackingCode && !trackingResult && (
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700">Project not found. Please check your tracking code.</p>
                    <p className="text-sm text-red-600 mt-1">
                      Try: {mockProjects.slice(0, 5).map(p => p.id).join(', ')} or any other project tracking reference
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real-time Statistics & Charts Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Real-time Project Statistics
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Live data and comprehensive analytics on agricultural infrastructure projects across the Philippines.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Project Status Distribution
                </CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectStats.statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{item.count} projects</div>
                        <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Project Types
                </CardTitle>
                <CardDescription>Distribution by project category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectStats.projectTypes.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-sm text-muted-foreground">{item.count} projects</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Distribution */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Regional Project Distribution
              </CardTitle>
              <CardDescription>Projects and budget allocation by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {projectStats.regionalDistribution.slice(0, 8).map((region, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm">{region.region}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Projects:</span>
                        <span className="font-medium">{region.projects}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Budget:</span>
                        <span className="font-medium">₱{(region.budget / 1000000).toFixed(0)}M</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Download Reports Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Download Reports
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Access comprehensive reports and analytics on agricultural infrastructure projects.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Quarterly Report
                </CardTitle>
                <CardDescription>
                  Q1 2024 comprehensive project status and budget analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => downloadReport('quarterly')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Annual Report
                </CardTitle>
                <CardDescription>
                  2023 complete annual performance and achievements summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => downloadReport('annual')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Status
                </CardTitle>
                <CardDescription>
                  Current status of all active projects with detailed progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => downloadReport('projects')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              System Capabilities & Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools for managing agricultural infrastructure projects, 
              farm-to-market roads, and engineering initiatives across the Philippines.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-6">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Access the ABEMIS System
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Authorized personnel can access the system to manage projects, 
              monitor implementations, and coordinate agricultural infrastructure initiatives.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Button 
              onClick={() => handleLoginClick('Login to System')}
              size="lg" 
              variant="secondary"
              className="transition-all duration-200 transform hover:scale-105"
              type="button"
            >
              Login to System
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Mobile Access
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <AbemisLogo size="lg" textSize="lg" />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Agricultural & Biosystems Engineering Management Information System - 
                Official information system of the Department of Agriculture - Bureau of Agricultural and Fisheries Engineering.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">System Capabilities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Project Creation & Planning</li>
                <li>Approval Workflows</li>
                <li>Implementation Monitoring</li>
                <li>Farm-to-Market Road Management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support & Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>System Documentation</li>
                <li>User Training</li>
                <li>Technical Support</li>
                <li>Regional Coordination</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Department of Agriculture - Bureau of Agricultural and Fisheries Engineering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
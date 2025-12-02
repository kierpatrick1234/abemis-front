'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Design4 } from '@/components/design4'
import { Design5 } from '@/components/design5'
import { Chatbot } from '@/components/chatbot'
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
  const [selectedDesign, setSelectedDesign] = useState('design3')
  const [isVisible, setIsVisible] = useState(false)
  const [scrollAnimations, setScrollAnimations] = useState<Record<string, boolean>>({})
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Trigger entrance animation on mount and when design changes
  useEffect(() => {
    // Reset animation state first
    setIsVisible(false)
    setScrollAnimations({})
    // Small delay to ensure reset is applied, then trigger animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [selectedDesign])

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setScrollAnimations(prev => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('[data-animate]')
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [selectedDesign])

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const handleAlertClick = () => {
    alert('ABEMIS alert: please contact your administrator for access details.')
  }

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

  // Get first 10 projects for dropdown
  const availableProjects = mockProjects.slice(0, 10)

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
    { label: "Active Projects", value: "35,952", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Infra & Machinery Projects", value: "187+", icon: <Globe className="h-5 w-5" /> },
    { label: "Authorized Users", value: "50+", icon: <Users className="h-5 w-5" /> },
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
            <div className="flex items-center gap-4">
              <Select value={selectedDesign} onValueChange={setSelectedDesign}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose Design" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design1">Modern Cards</SelectItem>
                  <SelectItem value="design2">Minimalist</SelectItem>
                  <SelectItem value="design3">Dashboard Style</SelectItem>
                  <SelectItem value="design4">Clean Corporate</SelectItem>
                  <SelectItem value="design5">Clean Dashboard</SelectItem>
                </SelectContent>
              </Select>
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
        </div>
      </nav>

      {/* Conditional Design Rendering */}
      {selectedDesign === 'design1' && (
        <Design1 
          handleLoginClick={handleLoginClick}
          handleAlertClick={handleAlertClick}
          trackingCode={trackingCode}
          setTrackingCode={setTrackingCode}
          trackingResult={trackingResult}
          handleTrackingSearch={handleTrackingSearch}
          downloadReport={downloadReport}
          features={features}
          stats={stats}
          projectStats={projectStats}
          availableProjects={availableProjects}
        />
      )}
      
      {selectedDesign === 'design2' && (
        <Design2 
          handleLoginClick={handleLoginClick}
          handleAlertClick={handleAlertClick}
          trackingCode={trackingCode}
          setTrackingCode={setTrackingCode}
          trackingResult={trackingResult}
          handleTrackingSearch={handleTrackingSearch}
          downloadReport={downloadReport}
          features={features}
          stats={stats}
          projectStats={projectStats}
          availableProjects={availableProjects}
        />
      )}
      
      {selectedDesign === 'design3' && (
        <Design3 
          handleLoginClick={handleLoginClick}
          handleAlertClick={handleAlertClick}
          trackingCode={trackingCode}
          setTrackingCode={setTrackingCode}
          trackingResult={trackingResult}
          handleTrackingSearch={handleTrackingSearch}
          downloadReport={downloadReport}
          features={features}
          stats={stats}
          projectStats={projectStats}
          availableProjects={availableProjects}
          isVisible={isVisible}
          scrollAnimations={scrollAnimations}
          scrollToDashboard={scrollToDashboard}
          dashboardRef={dashboardRef}
        />
      )}

      {selectedDesign === 'design4' && (
        <Design4 
          handleLoginClick={handleLoginClick}
          trackingCode={trackingCode}
          setTrackingCode={setTrackingCode}
          trackingResult={trackingResult}
          handleTrackingSearch={handleTrackingSearch}
          downloadReport={downloadReport}
          features={features}
          stats={stats}
          projectStats={projectStats}
          availableProjects={availableProjects}
        />
      )}

      {selectedDesign === 'design5' && (
        <Design5 
          handleLoginClick={handleLoginClick}
          trackingCode={trackingCode}
          setTrackingCode={setTrackingCode}
          trackingResult={trackingResult}
          handleTrackingSearch={handleTrackingSearch}
          downloadReport={downloadReport}
          features={features}
          stats={stats}
          projectStats={projectStats}
          availableProjects={availableProjects}
          isVisible={isVisible}
          scrollAnimations={scrollAnimations}
          scrollToDashboard={scrollToDashboard}
          dashboardRef={dashboardRef}
        />
      )}


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
            <p>&copy; 2025 Department of Agriculture - Bureau of Agricultural and Fisheries Engineering. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}

// Design 1: Modern Card-based Layout
function Design1({ 
  handleLoginClick, 
  handleAlertClick,
  trackingCode, 
  setTrackingCode, 
  trackingResult, 
  handleTrackingSearch, 
  downloadReport, 
  features, 
  stats, 
  projectStats,
  availableProjects
}: any) {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-background to-muted/50">
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
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
                onClick={handleAlertClick}
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                type="button"
              >
                Show Alert
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border text-foreground hover:bg-muted"
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
            {stats.map((stat: any, index: number) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </Card>
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
            <Card className="p-8 shadow-xl">
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
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter project tracking reference"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleTrackingSearch} className="px-8">
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">Or select from available projects:</span>
                  </div>
                  <Select value={trackingCode} onValueChange={setTrackingCode}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a project to track" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.id} - {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {trackingResult && (
                  <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{trackingResult.title}</h3>
                        <p className="text-sm text-muted-foreground">{trackingResult.region}</p>
                        <p className="text-sm text-muted-foreground">{trackingResult.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={trackingResult.status === 'Completed' ? 'default' : 'secondary'}>
                              {trackingResult.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Type</span>
                            <span className="text-sm font-medium">{trackingResult.type}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Budget</span>
                            <span className="text-sm font-semibold">₱{trackingResult.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Start Date</span>
                            <span className="text-sm font-medium">{new Date(trackingResult.startDate).toLocaleDateString()}</span>
                          </div>
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
                        {trackingResult.milestones.map((milestone: any, index: number) => {
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
                  </div>
                )}
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
            {features.map((feature: any, index: number) => (
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
    </>
  )
}

// Design 2: Minimalist Clean Layout
function Design2({ 
  handleLoginClick, 
  handleAlertClick,
  trackingCode, 
  setTrackingCode, 
  trackingResult, 
  handleTrackingSearch, 
  downloadReport, 
  features, 
  stats, 
  projectStats,
  availableProjects
}: any) {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-background via-muted/30 to-background">
        
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-light text-foreground leading-tight">
                ABEMIS
                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-4">
                  Agricultural & Biosystems Engineering Management Information System
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Official information system of the Department of Agriculture - 
                Bureau of Agricultural and Fisheries Engineering (DA-BAFE) Central Office.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                onClick={() => handleLoginClick('Access System')}
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 transition-colors duration-200"
                type="button"
              >
                Access System
              </Button>
              <Button
                onClick={handleAlertClick}
                size="lg"
                variant="outline"
                className="border border-foreground/30 text-foreground hover:bg-muted"
                type="button"
              >
                Show Alert
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="text-foreground hover:bg-muted"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="text-center space-y-4">
                <div className="text-4xl font-light text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
        </div>
      </section>

      {/* Project Tracking Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-3xl font-light text-foreground">
              Project Tracking
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your project tracking code to view real-time status and progress.
            </p>
          </div>
          
          <div className="max-w-xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter project tracking reference"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 border-0 border-b-2 border-muted-foreground/20 rounded-none focus:border-foreground"
                  />
                  <Button onClick={handleTrackingSearch} variant="outline" className="px-8">
                    Track
                  </Button>
                </div>
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">Or select from available projects:</span>
                </div>
                <Select value={trackingCode} onValueChange={setTrackingCode}>
                  <SelectTrigger className="w-full border-0 border-b-2 border-muted-foreground/20 rounded-none focus:border-foreground">
                    <SelectValue placeholder="Select a project to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProjects.map((project: any) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.id} - {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {trackingResult && (
                <div className="space-y-6 p-8 border border-muted-foreground/20">
                <div className="space-y-4">
                    <h3 className="text-xl font-medium">{trackingResult.title}</h3>
                      <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{trackingResult.region}</span>
                      <span className="text-sm font-medium">₱{trackingResult.budget.toLocaleString()}</span>
                      </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{trackingResult.status}</Badge>
                      <span className="text-sm">{trackingResult.progress}% Complete</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted/30 h-1">
                    <div 
                      className="bg-foreground h-1 transition-all duration-300"
                      style={{ width: `${trackingResult.progress}%` }}
                        />
                      </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Milestones</h4>
                    <div className="space-y-2">
                      {trackingResult.milestones.map((milestone: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-foreground' : 'bg-muted-foreground/30'}`} />
                          <span className={milestone.completed ? 'text-foreground' : 'text-muted-foreground'}>
                            {milestone.name}
                          </span>
                    </div>
                  ))}
                </div>
          </div>
                </div>
              )}
              
              {trackingCode && !trackingResult && (
                <div className="text-center p-8 border border-red-200">
                  <p className="text-red-600">Project not found. Please check your tracking code.</p>
                      </div>
              )}
                      </div>
                    </div>
                  </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-3xl font-light text-foreground">
              System Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for managing agricultural infrastructure projects.
            </p>
              </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature: any, index: number) => (
              <div key={index} className="space-y-4">
                <div className="w-12 h-12 bg-muted/50 flex items-center justify-center">
                  <div className="text-foreground">
                    {feature.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-light text-foreground">
              Access the ABEMIS System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Authorized personnel can access the system to manage projects and monitor implementations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                <Button 
              onClick={() => handleLoginClick('Login to System')}
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90"
              type="button"
            >
              Login to System
                </Button>
                <Button 
              variant="ghost" 
              size="lg" 
              className="text-foreground hover:bg-muted"
            >
              Mobile Access
                </Button>
          </div>
        </div>
      </section>
    </>
  )
}

// Design 3: Dashboard-style Layout
function Design3({ 
  handleLoginClick, 
  handleAlertClick,
  trackingCode, 
  setTrackingCode, 
  trackingResult, 
  handleTrackingSearch, 
  downloadReport, 
  features, 
  stats, 
  projectStats,
  availableProjects,
  isVisible,
  scrollAnimations,
  scrollToDashboard,
  dashboardRef
}: any) {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: 'url(/landing-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className={`text-4xl md:text-5xl font-bold text-white leading-tight transition-all duration-1000 ease-out transform ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}>
                  ABEMIS 3.0
                  <span className={`block text-2xl md:text-3xl font-semibold text-amber-300 mt-2 transition-all duration-1000 ease-out transform delay-300 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}>
                    Agricultural & Biosystems Engineering Management Information System
                  </span>
                </h1>
                <p className={`text-lg text-white/90 leading-relaxed transition-all duration-1000 ease-out transform delay-500 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}>
                  Official information system of the Department of Agriculture - 
                  Bureau of Agricultural and Fisheries Engineering (DA-BAFE) Central Office, 
                  designed to manage agricultural infrastructure projects across the Philippines.
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out transform delay-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}>
                <Button 
                  onClick={() => handleLoginClick('Access System')}
                  size="lg" 
                  className="transition-all duration-300 transform hover:scale-105"
                  type="button"
                >
                  Access System
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={handleAlertClick}
                  size="lg"
                  variant="secondary"
                  className="transition-all duration-300 transform hover:scale-105"
                  type="button"
                >
                  Show Alert
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={scrollToDashboard}
                  className="border-white/30 text-black bg-white/90 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="flex justify-end">
              <div className="grid grid-cols-2 gap-4 max-w-md">
              {stats.map((stat: any, index: number) => (
                <Card 
                  key={index} 
                  className={`p-6 text-center hover:shadow-lg transition-all duration-1000 ease-out bg-white/20 backdrop-blur-md border border-white/30 transform hover:scale-105 hover:bg-white/30 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{
                    transitionDelay: `${900 + (index * 200)}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-white/30 rounded-lg mx-auto mb-4">
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
            </Card>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section ref={dashboardRef} className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Status Distribution */}
            <Card 
              data-animate
              id="project-status"
              className={`p-6 transition-all duration-1000 ease-out transform ${
                scrollAnimations['project-status'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Project Status</h3>
              </div>
              <div className="space-y-4">
                {projectStats.statusDistribution.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Project Types */}
            <Card 
              data-animate
              id="project-types"
              className={`p-6 transition-all duration-1000 ease-out transform delay-200 ${
                scrollAnimations['project-types'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Project Types</h3>
              </div>
              <div className="space-y-4">
                {projectStats.projectTypes.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-xs text-muted-foreground">{item.count}</span>
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
            </Card>
          </div>
        </div>
      </section>

      {/* Project Tracking Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate
            id="tracking-header"
            className={`text-center mb-12 space-y-4 transition-all duration-1000 ease-out transform ${
              scrollAnimations['tracking-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="text-3xl font-bold text-foreground">
              Project Tracking Dashboard
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your project tracking code to view real-time status, progress, and milestones.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card 
              data-animate
              id="tracking-card"
              className={`p-6 transition-all duration-1000 ease-out transform delay-300 ${
                scrollAnimations['tracking-card'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter project tracking reference"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleTrackingSearch} className="px-8">
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">Or select from available projects:</span>
                  </div>
                  <Select value={trackingCode} onValueChange={setTrackingCode}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a project to track" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.id} - {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {trackingResult && (
                  <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{trackingResult.title}</h3>
                        <p className="text-sm text-muted-foreground">{trackingResult.region}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={trackingResult.status === 'Completed' ? 'default' : 'secondary'}>
                          {trackingResult.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">₱{trackingResult.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{trackingResult.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trackingResult.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Project Milestones</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {trackingResult.milestones.map((milestone: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {milestone.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={milestone.completed ? 'text-green-700' : 'text-muted-foreground'}>
                              {milestone.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {trackingCode && !trackingResult && (
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700 text-sm">Project not found. Please check your tracking code.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate
            id="features-header"
            className={`text-center mb-12 space-y-4 transition-all duration-1000 ease-out transform ${
              scrollAnimations['features-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="text-3xl font-bold text-foreground">
              System Capabilities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for managing agricultural infrastructure projects.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature: any, index: number) => (
              <Card 
                key={index} 
                data-animate
                id={`feature-${index}`}
                className={`p-6 hover:shadow-lg transition-all duration-1000 ease-out transform hover:scale-105 ${
                  scrollAnimations[`feature-${index}`] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                    {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Access the ABEMIS System
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Authorized personnel can access the system to manage projects and monitor implementations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </>
  )
}
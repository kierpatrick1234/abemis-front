'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { EPDSDProjectDetailsModal } from '@/components/epdsd-project-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, CheckCircle, XCircle, FileText, Clock, User, MessageSquare, Download, Eye, Grid3X3, List, CheckSquare } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'
import { useEvaluation } from '@/lib/contexts/evaluation-context'

// Mock data for evaluated projects - this would come from a database in a real app
const mockEvaluatedProjects = [
  {
    id: 'PRJ-EPDSD-001',
    title: 'Rural Water Supply System - Region 1',
    type: 'Infrastructure',
    province: 'Ilocos Norte',
    region: 'Region 1',
    status: 'Evaluated',
    description: 'A comprehensive water supply system for rural communities in Ilocos Norte',
    budget: 15000000,
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    updatedAt: '2024-01-20T10:30:00Z',
    evaluatedAt: '2024-01-25T14:30:00Z',
    evaluatedBy: 'John EPDSD Officer',
    evaluationStatus: 'Approved',
    evaluationComments: 'All documents reviewed and approved. Project meets all requirements.',
    documentsStatus: {
      letterOfIntent: true,
      validationReport: true,
      feasibilityStudy: true,
      detailedDesign: true,
      programOfWork: true,
      rightOfWay: true
    }
  },
  {
    id: 'PRJ-EPDSD-003',
    title: 'Road Construction Project - Region 3',
    type: 'Infrastructure',
    province: 'Nueva Ecija',
    region: 'Region 3',
    status: 'Evaluated',
    description: 'Construction of farm-to-market roads in Nueva Ecija',
    budget: 30000000,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    updatedAt: '2024-01-25T09:15:00Z',
    evaluatedAt: '2024-01-28T16:45:00Z',
    evaluatedBy: 'John EPDSD Officer',
    evaluationStatus: 'Approved',
    evaluationComments: 'Project approved with minor recommendations for budget optimization.',
    documentsStatus: {
      letterOfIntent: true,
      validationReport: true,
      feasibilityStudy: true,
      detailedDesign: true,
      programOfWork: true,
      rightOfWay: true
    }
  },
  {
    id: 'PRJ-EPDSD-005',
    title: 'Heavy Equipment Procurement - Region 5',
    type: 'Machinery',
    province: 'Camarines Sur',
    region: 'Region 5',
    status: 'Evaluated',
    description: 'Procurement of heavy equipment for construction projects',
    budget: 35000000,
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    updatedAt: '2024-02-01T08:30:00Z',
    evaluatedAt: '2024-02-05T11:20:00Z',
    evaluatedBy: 'John EPDSD Officer',
    evaluationStatus: 'Rejected',
    evaluationComments: 'Insufficient documentation for environmental impact assessment. Requires resubmission.',
    documentsStatus: {
      letterOfIntent: true,
      validationReport: true,
      feasibilityStudy: false,
      detailedDesign: true,
      programOfWork: true,
      rightOfWay: false
    }
  }
]

export default function MyEvaluationPage() {
  const { user } = useAuth()
  const { getEvaluatedProjectsByUser } = useEvaluation()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  
  // Get evaluated projects for current user
  const contextEvaluatedProjects = getEvaluatedProjectsByUser(user?.name || '')
  
  // Also check localStorage as fallback
  const [localStorageProjects, setLocalStorageProjects] = useState<any[]>([])
  
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem('evaluatedProjects')
      if (stored) {
        const parsed = JSON.parse(stored)
        const userProjects = parsed.filter((p: any) => p.evaluatedBy === user?.name)
        setLocalStorageProjects(userProjects)
        console.log('My Evaluation - localStorage projects for user:', user?.name, 'found:', userProjects.length)
      }
    }
    
    loadFromLocalStorage()
    
    // Listen for storage changes (when evaluations are added from other tabs/pages)
    const handleStorageChange = () => {
      loadFromLocalStorage()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for updates
    const interval = setInterval(loadFromLocalStorage, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user?.name])
  
  // Combine both sources
  const evaluatedProjects = [...contextEvaluatedProjects, ...localStorageProjects]
  
  // Debug logging
  useEffect(() => {
    console.log('My Evaluation - User:', user?.name)
    console.log('My Evaluation - User object:', user)
    console.log('My Evaluation - Context Projects:', contextEvaluatedProjects.length)
    console.log('My Evaluation - localStorage Projects:', localStorageProjects.length)
    console.log('My Evaluation - Total Projects:', evaluatedProjects.length)
    console.log('My Evaluation - All localStorage data:', localStorage.getItem('evaluatedProjects'))
  }, [user?.name, contextEvaluatedProjects, localStorageProjects, evaluatedProjects])
  
  // Reset filters function
  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setTypeFilter('all')
    setRegionFilter('all')
    setStatusFilter('all')
  }, [])

  const handleRowClick = useCallback((project: unknown) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  // Get unique regions for filter options
  const uniqueRegions = Array.from(new Set(evaluatedProjects.map(project => project.region)))
    .sort((a, b) => {
      const getRegionNumber = (region: string) => {
        const match = region.match(/Region (\d+)/)
        return match ? parseInt(match[1], 10) : 999
      }
      return getRegionNumber(a) - getRegionNumber(b)
    })

  const filteredProjects = evaluatedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.province.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    const matchesRegion = regionFilter === 'all' || project.region === regionFilter
    const matchesStatus = statusFilter === 'all' || project.evaluationStatus === statusFilter
    return matchesSearch && matchesType && matchesRegion && matchesStatus
  }).sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'Project Title',
      render: (value: unknown, row: unknown) => (
        <div>
          <div className="font-medium">{(row as { title: string }).title}</div>
          <div className="text-sm text-muted-foreground">{(row as { province: string }).province}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown, row: unknown) => (
        <Badge variant={(row as { type: string }).type === 'Infrastructure' ? 'default' : 'secondary'}>
          {(row as { type: string }).type}
        </Badge>
      )
    },
    {
      key: 'evaluationStatus',
      label: 'Evaluation Status',
      render: (value: unknown, row: unknown) => {
        const status = (row as { evaluationStatus: string }).evaluationStatus
        return (
          <Badge variant={status === 'Approved' ? 'default' : 'destructive'}>
            {status}
          </Badge>
        )
      }
    },
    {
      key: 'evaluatedAt',
      label: 'Evaluated Date',
      render: (value: unknown, row: unknown) => formatDate((row as { evaluatedAt: string }).evaluatedAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: unknown) => (
        <ActionMenu
          actions={[
            {
              label: 'View Details',
              onClick: () => handleRowClick(row as Record<string, unknown>)
            },
            {
              label: 'View Evaluation',
              onClick: () => handleRowClick(row as Record<string, unknown>)
            }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Evaluation</h1>
        <p className="text-muted-foreground">
          Projects evaluated by {user?.name || 'you'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Evaluated</p>
                <p className="text-2xl font-bold">{evaluatedProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {evaluatedProjects.filter(p => p.evaluationStatus === 'Approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {evaluatedProjects.filter(p => p.evaluationStatus === 'Rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {evaluatedProjects.filter(p => {
                    const evaluatedDate = new Date(p.evaluatedAt)
                    const now = new Date()
                    return evaluatedDate.getMonth() === now.getMonth() && 
                           evaluatedDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
          
          {/* Type Filters */}
          <div className="flex gap-1">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('all')}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'Infrastructure' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('Infrastructure')}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Infra
            </Button>
            <Button
              variant={typeFilter === 'Machinery' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('Machinery')}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Machinery
            </Button>
          </div>
          
          {/* Region Filter */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {uniqueRegions.map(region => (
                <SelectItem key={region} value={region} className="text-xs">
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Results Count */}
          <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded h-8">
            {filteredProjects.length} projects
          </div>
          
          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 px-3 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Evaluated Projects ({filteredProjects.length})</CardTitle>
              <CardDescription>
                Projects you have personally evaluated
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="default"
                  onClick={() => setViewMode('table')}
                  className="h-10 px-4"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="default"
                  onClick={() => setViewMode('grid')}
                  className="h-10 px-4"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {viewMode === 'grid' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((project) => {
                  const totalDocuments = 6
                  const uploadedDocuments = Object.values(project.documentsStatus).filter(Boolean).length
                  
                  return (
                    <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRowClick(project)}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm leading-tight line-clamp-2">{project.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{project.province}</p>
                            </div>
                            <Badge variant={project.type === 'Infrastructure' ? 'default' : 'secondary'} className="text-xs ml-2">
                              {project.type}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Status</span>
                              <Badge variant={project.evaluationStatus === 'Approved' ? 'default' : 'destructive'} className="text-xs">
                                {project.evaluationStatus}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Documents</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">{uploadedDocuments}/{totalDocuments}</span>
                                <Badge 
                                  variant={uploadedDocuments === totalDocuments ? "default" : uploadedDocuments > 0 ? "secondary" : "destructive"}
                                  className="text-xs"
                                >
                                  {uploadedDocuments === totalDocuments ? "Complete" : uploadedDocuments > 0 ? "Partial" : "None"}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Evaluated</span>
                              <span className="text-xs">{formatDate(project.evaluatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <DataTable
              data={filteredProjects}
              columns={columns}
              onRowClick={(row) => handleRowClick(row as Record<string, unknown>)}
              enablePagination={true}
              pageSize={5}
              pageSizeOptions={[5, 10, 25, 50, 100]}
            />
          )}
        </CardContent>
      </Card>

      {/* Project Details Modal */}
      <EPDSDProjectDetailsModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false)
          setSelectedProject(null)
        }}
      />
    </div>
  )
}

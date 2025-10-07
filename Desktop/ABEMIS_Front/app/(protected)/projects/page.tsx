'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewProjectModal } from '@/components/new-project-modal'
import { SuccessToast } from '@/components/success-toast'
import { ProjectDetailsModal } from '@/components/project-details-modal'
import { mockProjects } from '@/lib/mock/data'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'
import { Search, Filter, Plus } from 'lucide-react'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [newProjects, setNewProjects] = useState<any[]>([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastCountdown, setToastCountdown] = useState(10)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const { user } = useAuth()

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])


  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const handleRowClick = useCallback((project: any) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setTypeFilter('all')
    setStatusFilter('all')
  }, [])

  const handleCreateProject = useCallback((projectData: any) => {
    console.log('Creating new project:', projectData)
    
    // Create a new project object with proper structure
    const newProject = {
      id: `PROJ-${Date.now()}`, // Generate unique ID
      title: projectData.title || 'New Infrastructure Project',
      type: projectData.type || 'Infrastructure',
      status: 'Proposal',
      budget: projectData.allocatedAmount ? parseFloat(projectData.allocatedAmount) : 0,
      province: projectData.province || 'Unknown',
      region: projectData.region || 'Unknown',
      updatedAt: new Date().toISOString(),
      // Add all the form data
      ...projectData
    }
    
    // Add to new projects list
    setNewProjects(prev => [newProject, ...prev])
    
    // Show success toast
    setShowSuccessToast(true)
    setToastCountdown(10)
    
    // Auto-hide toast after 10 seconds
    const timer = setInterval(() => {
      setToastCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowSuccessToast(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    // TODO: Implement actual project creation logic
    // This would typically involve API calls to create the project
  }, [])

  // Combine mock projects with new projects
  const allProjects = [...newProjects, ...mockProjects]
  
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    
    // For RAED users, filter by their assigned region
    let matchesRegion = true
    if (user?.role === 'RAED' && user?.regionAssigned) {
      matchesRegion = project.region === user.regionAssigned
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesRegion
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.province}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'FMR' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              onClick: () => handleEditProject(row.id)
            },
            {
              label: 'Duplicate',
              onClick: () => handleDuplicateProject(row.id)
            },
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage infrastructure and FMR projects
          </p>
        </div>
        <Button onClick={() => setIsNewProjectModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Compact Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 py-2 border border-input bg-background rounded-md text-sm min-w-[120px]"
          >
            <option value="all">All Types</option>
            <option value="FMR">FMR</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Machinery">Machinery</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 py-2 border border-input bg-background rounded-md text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="Proposal">Proposal</option>
            <option value="Procurement">Procurement</option>
            <option value="Implementation">Implementation</option>
            <option value="Completed">Completed</option>
          </select>
          
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="h-10 px-3"
          >
            <Filter className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Infrastructure and FMR project listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredProjects} onRowClick={handleRowClick} />
        </CardContent>
      </Card>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreate={handleCreateProject}
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        countdown={toastCountdown}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
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

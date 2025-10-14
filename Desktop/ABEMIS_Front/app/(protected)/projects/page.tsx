'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewProjectModal } from '@/components/new-project-modal'
import { InfraProjectModal } from '@/components/infra-project-modal'
import { SuccessToast } from '@/components/success-toast'
import { ProjectDetailsModal } from '@/components/project-details-modal'
import { mockProjects } from '@/lib/mock/data'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'
import { Project } from '@/lib/types'
import { Search, Filter, Plus, FileText, ShoppingCart, Hammer, CheckCircle, Package, Edit3, List, Grid3X3, MapPin, Calendar, DollarSign } from 'lucide-react'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [newProjects, setNewProjects] = useState<Project[]>([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastCountdown, setToastCountdown] = useState(10)
  const [toastMessage, setToastMessage] = useState('Project created successfully!')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingDraft, setEditingDraft] = useState<Project | null>(null)
  const [showInfraCreationModal, setShowInfraCreationModal] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const { user } = useAuth()

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])


  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const handleRowClick = useCallback((project: Project) => {
    if (project.status === 'Draft') {
      // For draft projects, open the InfraProjectModal directly for editing
      setEditingDraft(project)
      // Open the appropriate modal based on project type
      if (project.type === 'Infrastructure') {
        setShowInfraCreationModal(true)
      } else {
        // For other types, open the type selection modal
        setIsNewProjectModalOpen(true)
      }
    } else {
      // For non-draft projects, open the project details modal
      setSelectedProject(project)
      setShowProjectModal(true)
    }
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setTypeFilter('all')
    setStageFilter('all')
  }, [])

  const handleTypeFilterChange = useCallback((newTypeFilter: string) => {
    setTypeFilter(newTypeFilter)
    // Reset stage filter when type filter changes to avoid invalid combinations
    setStageFilter('all')
  }, [])

  const handleCreateProject = useCallback((projectData: any) => {
    if (editingDraft) {
      // Update existing draft project
      console.log('Updating draft project:', editingDraft.id, projectData)
      
      const updatedProject: Project = {
        ...editingDraft,
        title: projectData.projectTitle || projectData.title || editingDraft.title,
        type: (projectData.type as Project['type']) || editingDraft.type,
        status: projectData.status || editingDraft.status,
        budget: projectData.allocatedAmount ? parseFloat(projectData.allocatedAmount) : editingDraft.budget,
        province: projectData.province || editingDraft.province,
        region: projectData.region || editingDraft.region,
        description: projectData.projectDescription || projectData.description || editingDraft.description,
        // Infrastructure project specific fields
        projectClassification: projectData.projectClassification || editingDraft.projectClassification,
        projectType: projectData.projectType || editingDraft.projectType,
        implementationDays: projectData.implementationDays || editingDraft.implementationDays,
        prexcProgram: projectData.prexcProgram || editingDraft.prexcProgram,
        prexcSubProgram: projectData.prexcSubProgram || editingDraft.prexcSubProgram,
        budgetProcess: projectData.budgetProcess || editingDraft.budgetProcess,
        proposedFundSource: projectData.proposedFundSource || editingDraft.proposedFundSource,
        sourceAgency: projectData.sourceAgency || editingDraft.sourceAgency,
        bannerProgram: projectData.bannerProgram || editingDraft.bannerProgram,
        fundingYear: projectData.fundingYear || editingDraft.fundingYear,
        municipality: projectData.municipality || editingDraft.municipality,
        district: projectData.district || editingDraft.district,
        barangay: projectData.barangay || editingDraft.barangay,
        documents: projectData.documents || editingDraft.documents,
        updatedAt: new Date().toISOString(),
      }
      
      // Update the project in the list
      setNewProjects(prev => prev.map(p => p.id === editingDraft.id ? updatedProject : p))
      
      // Clear editing draft
      setEditingDraft(null)
      
      // Set appropriate toast message
      if (projectData.isDraftSave) {
        setToastMessage('Project saved as draft!')
      } else {
        setToastMessage('Project updated successfully!')
      }
    } else {
      // Create a new project object with proper structure
      console.log('Creating new project:', projectData)
      
      const newProject: Project = {
        id: `PROJ-${Date.now()}`, // Generate unique ID
        title: projectData.projectTitle || projectData.title || (projectData.type === 'Machinery' ? 'New Machinery Project' : 'New Infrastructure Project'),
        type: (projectData.type as Project['type']) || 'Infrastructure',
        status: projectData.status || (projectData.isDraftSave ? 'Draft' : 'Proposal'),
        budget: projectData.allocatedAmount ? parseFloat(projectData.allocatedAmount) : 0,
        province: projectData.province || 'Unknown',
        region: projectData.region || 'Unknown',
        description: projectData.projectDescription || projectData.description || 'New project description',
        startDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
        // Infrastructure project specific fields
        projectClassification: projectData.projectClassification,
        projectType: projectData.projectType,
        implementationDays: projectData.implementationDays,
        prexcProgram: projectData.prexcProgram,
        prexcSubProgram: projectData.prexcSubProgram,
        budgetProcess: projectData.budgetProcess,
        proposedFundSource: projectData.proposedFundSource,
        sourceAgency: projectData.sourceAgency,
        bannerProgram: projectData.bannerProgram,
        fundingYear: projectData.fundingYear,
        municipality: projectData.municipality,
        district: projectData.district,
        barangay: projectData.barangay,
        documents: projectData.documents,
      }
      
      // Add to new projects list
      setNewProjects(prev => [newProject, ...prev])
      
      // Set appropriate toast message
      if (projectData.isDraftSave) {
        setToastMessage('Project saved as draft!')
      } else {
        setToastMessage('Project created successfully!')
      }
    }
    
    // Close modals
    setIsNewProjectModalOpen(false)
    setShowInfraCreationModal(false)
    
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
    
    // TODO: Implement actual project creation/update logic
    // This would typically involve API calls to create or update the project
  }, [editingDraft])

  // Combine mock projects with new projects
  const allProjects = [...newProjects, ...mockProjects]
  
  const filteredProjects = allProjects.filter(project => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = project.title.toLowerCase().includes(searchLower) ||
                         project.id.toLowerCase().includes(searchLower) ||
                         project.description.toLowerCase().includes(searchLower) ||
                         project.province.toLowerCase().includes(searchLower) ||
                         (project.region && project.region.toLowerCase().includes(searchLower)) ||
                         (project.municipality && project.municipality.toLowerCase().includes(searchLower)) ||
                         (project.barangay && project.barangay.toLowerCase().includes(searchLower)) ||
                         (project.projectClassification && project.projectClassification.toLowerCase().includes(searchLower)) ||
                         (project.projectType && project.projectType.toLowerCase().includes(searchLower))
    
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    
    // Handle stage filtering
    let matchesStage = true
    if (stageFilter !== 'all') {
      matchesStage = project.status === stageFilter
    }
    
    // For RAED users, filter by their assigned region
    let matchesRegion = true
    if (user?.role === 'RAED' && user?.regionAssigned) {
      matchesRegion = project.region === user.regionAssigned
    }
    
    return matchesSearch && matchesType && matchesStage && matchesRegion
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: unknown, row: Project) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-sm text-muted-foreground">{row.province}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown) => (
        <Badge variant={(value as string) === 'FMR' ? 'secondary' : 'outline'}>
          {value as string}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={value as string} />
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: unknown) => formatDate(value as string)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: Project) => (
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
    <div className="space-y-6 pb-24">
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
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
        {/* Search and Type Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
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
              onChange={(e) => handleTypeFilterChange(e.target.value)}
              className="h-10 px-3 py-2 border border-input bg-background rounded-md text-sm min-w-[120px]"
            >
              <option value="all">All Types</option>
              <option value="FMR">FMR</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Machinery">Machinery</option>
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
        
        {/* Stage Filter Buttons - Dynamic based on project type */}
        {typeFilter !== 'all' && (
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border border-input bg-background p-1 flex-wrap gap-1">
              <Button
                variant={stageFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStageFilter('all')}
                className="rounded-md"
              >
                <Package className="h-4 w-4 mr-1" />
                All Stages
              </Button>
              <Button
                variant={stageFilter === 'Proposal' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStageFilter('Proposal')}
                className="rounded-md"
              >
                <FileText className="h-4 w-4 mr-1" />
                Proposal
              </Button>
              <Button
                variant={stageFilter === 'Procurement' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStageFilter('Procurement')}
                className="rounded-md"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Procurement
              </Button>
              
              {/* Infrastructure and FMR stages */}
              {typeFilter === 'Infrastructure' && (
                <>
                  <Button
                    variant={stageFilter === 'Implementation' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStageFilter('Implementation')}
                    className="rounded-md"
                  >
                    <Hammer className="h-4 w-4 mr-1" />
                    Implementation
                  </Button>
                  <Button
                    variant={stageFilter === 'Completed' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStageFilter('Completed')}
                    className="rounded-md"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </Button>
                </>
              )}
              
              {/* Machinery stages */}
              {typeFilter === 'Machinery' && (
                <>
                  <Button
                    variant={stageFilter === 'For Delivery' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStageFilter('For Delivery')}
                    className="rounded-md"
                  >
                    <Hammer className="h-4 w-4 mr-1" />
                    For Delivery
                  </Button>
                  <Button
                    variant={stageFilter === 'Delivered' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStageFilter('Delivered')}
                    className="rounded-md"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Delivered
                  </Button>
                </>
              )}
              
              <Button
                variant={stageFilter === 'Inventory' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStageFilter('Inventory')}
                className="rounded-md"
              >
                <Package className="h-4 w-4 mr-1" />
                Inventory
              </Button>
              <Button
                variant={stageFilter === 'Draft' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStageFilter('Draft')}
                className="rounded-md"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Draft
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Projects Table */}
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects ({filteredProjects.length})</CardTitle>
              <CardDescription>
                Infrastructure and FMR project listings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {viewMode === 'list' ? (
            <DataTable 
              columns={columns} 
              data={filteredProjects} 
              onRowClick={handleRowClick}
              enablePagination={true}
              pageSize={5}
              pageSizeOptions={[5, 10, 25, 50, 100]}
            />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(project)}
                  >
                    <div className="flex flex-col h-full">
                      {/* Project Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 line-clamp-2">{project.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{project.province}</span>
                          </div>
                        </div>
                        <Badge variant={project.type === 'FMR' ? 'secondary' : 'outline'} className="text-xs">
                          {project.type}
                        </Badge>
                      </div>
                      
                      {/* Project Type Display */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Type:</span>
                          <Badge 
                            variant={project.type === 'FMR' ? 'secondary' : project.type === 'Infrastructure' ? 'default' : 'outline'} 
                            className="text-xs"
                          >
                            {project.type}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Project Status */}
                      <div className="mb-3">
                        <StatusBadge status={project.status} />
                      </div>
                      
                      {/* Project Details */}
                      <div className="space-y-2 text-xs text-muted-foreground mb-4 flex-1">
                        {project.budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>₱{project.budget.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {formatDate(project.updatedAt)}</span>
                        </div>
                        {project.region && (
                          <div className="text-xs">
                            Region: {project.region}
                          </div>
                        )}
                        {project.municipality && (
                          <div className="text-xs">
                            {project.municipality}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProject(project.id)
                          }}
                          className="flex-1"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateProject(project.id)
                          }}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No projects found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => {
          setIsNewProjectModalOpen(false)
          setEditingDraft(null)
        }}
        onProjectCreate={handleCreateProject}
        editingDraft={editingDraft}
      />

      {/* Infrastructure Project Modal */}
      <InfraProjectModal
        isOpen={showInfraCreationModal}
        onClose={() => {
          setShowInfraCreationModal(false)
          setEditingDraft(null)
        }}
        onProjectCreate={handleCreateProject}
        editingDraft={editingDraft}
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        countdown={toastCountdown}
        message={toastMessage}
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

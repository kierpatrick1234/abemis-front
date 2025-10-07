'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionButton, ActionMenu } from '@/components/data-table'
import { ProjectDetailsModal } from '@/components/project-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, CheckCircle, XCircle, Eye, FileText } from 'lucide-react'
import { mockProjects } from '@/lib/mock/data'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'

export default function EPDSDProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const { user } = useAuth()

  // Filter projects for EPDSD - only Infrastructure and Machinery in Proposal stage
  const epdsdProjects = mockProjects.filter(project => 
    (project.type === 'Infrastructure' || project.type === 'Machinery') && 
    project.status === 'Proposal'
  )

  const handleViewProject = useCallback((projectId: string) => {
    const project = epdsdProjects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setShowEvaluationModal(true)
    }
  }, [epdsdProjects])

  const handleApproveProject = useCallback((projectId: string) => {
    console.log('Approving project:', projectId)
    // In a real app, this would update the project status to 'Procurement'
    alert('Project approved and moved to procurement stage!')
  }, [])

  const handleRejectProject = useCallback((projectId: string) => {
    console.log('Rejecting project:', projectId)
    alert('Project rejected. Please provide feedback to the submitting region.')
  }, [])

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])

  const handleDeleteProject = useCallback((projectId: string) => {
    console.log('Delete project', projectId)
    // TODO: Implement delete functionality with confirmation
  }, [])

  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const handleRowClick = useCallback((project: any) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  const filteredProjects = epdsdProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.province.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    return matchesSearch && matchesType
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      header: 'Project Title',
      render: (project: any) => (
        <div>
          <div className="font-medium">{project.title}</div>
          <div className="text-sm text-muted-foreground">{project.province}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (project: any) => (
        <Badge variant={project.type === 'Infrastructure' ? 'default' : 'secondary'}>
          {project.type}
        </Badge>
      )
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (project: any) => formatCurrency(project.budget)
    },
    {
      key: 'status',
      header: 'Status',
      render: (project: any) => <StatusBadge status={project.status} />
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (project: any) => formatDate(project.updatedAt)
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project: any) => (
        <ActionMenu
          actions={[
            {
              label: 'View Details',
              onClick: () => handleRowClick(project)
            },
            {
              label: 'Approve',
              onClick: () => handleApproveProject(project.id)
            },
            {
              label: 'Reject',
              onClick: () => handleRejectProject(project.id),
              variant: 'destructive'
            },
            {
              label: 'Edit',
              onClick: () => handleEditProject(project.id)
            },
            {
              label: 'Duplicate',
              onClick: () => handleDuplicateProject(project.id)
            }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">EPDSD Project Evaluation</h1>
        <p className="text-muted-foreground">
          Evaluate Infrastructure and Machinery projects in proposal stage
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Project Filters</CardTitle>
          <CardDescription>Filter projects for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
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
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
                size="sm"
              >
                All Types
              </Button>
              <Button
                variant={typeFilter === 'Infrastructure' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('Infrastructure')}
                size="sm"
              >
                Infrastructure
              </Button>
              <Button
                variant={typeFilter === 'Machinery' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('Machinery')}
                size="sm"
              >
                Machinery
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Pending Evaluation ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Infrastructure and Machinery projects requiring EPDSD evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredProjects}
            columns={columns}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Evaluation - {selectedProject.title}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Review project requirements and approve or reject
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {selectedProject.type}</div>
                    <div><strong>Province:</strong> {selectedProject.province}</div>
                    <div><strong>Budget:</strong> {formatCurrency(selectedProject.budget)}</div>
                    <div><strong>Status:</strong> <StatusBadge status={selectedProject.status} /></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Start Date:</strong> {formatDate(selectedProject.startDate)}</div>
                    <div><strong>End Date:</strong> {formatDate(selectedProject.endDate)}</div>
                    <div><strong>Updated:</strong> {formatDate(selectedProject.updatedAt)}</div>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div>
                <h4 className="font-medium mb-4">Documentary Requirements Checklist</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Project Proposal Document</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Technical Specifications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Budget Breakdown</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Environmental Impact Assessment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Community Consultation Report</span>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <h4 className="font-medium mb-2">Project Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectProject(selectedProject.id)
                    setShowEvaluationModal(false)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApproveProject(selectedProject.id)
                    setShowEvaluationModal(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Move to Procurement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

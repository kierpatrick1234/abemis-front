'use client'

import { useState, useCallback } from 'react'
import { DataTable, StatusBadge, ActionMenu } from '@/components/data-table'
import { ProjectDetailsModal } from '@/components/project-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, CheckCircle, XCircle, MapPin } from 'lucide-react'
import { mockProjects } from '@/lib/mock/data'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function SEPDProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<unknown>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  // Filter projects for SEPD - only FMR projects in Proposal stage
  const sepdProjects = mockProjects.filter(project => 
    project.type === 'FMR' && project.status === 'Proposal'
  )


  const handleValidateProject = useCallback((projectId: string) => {
    console.log('Validating FMR project:', projectId)
    // In a real app, this would validate the FMR project requirements
    alert('FMR project validated and approved to proceed to next stage!')
  }, [])

  const handleRejectProject = useCallback((projectId: string) => {
    console.log('Rejecting FMR project:', projectId)
    alert('FMR project rejected. Please provide feedback to the submitting region.')
  }, [])

  const handleEditProject = useCallback((projectId: string) => {
    console.log('Edit project', projectId)
    // TODO: Implement edit functionality
  }, [])


  const handleDuplicateProject = useCallback((projectId: string) => {
    console.log('Duplicate project', projectId)
    // TODO: Implement duplicate functionality
  }, [])

  const handleRowClick = useCallback((project: unknown) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }, [])

  const filteredProjects = sepdProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.province.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const columns = [
    {
      key: 'title',
      label: 'FMR Project Title',
      render: (value: unknown, row: unknown) => (
        <div>
          <div className="font-medium">{(row as { title: string }).title}</div>
          <div className="text-sm text-muted-foreground flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {(row as { province: string }).province}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: unknown) => <StatusBadge status={(row as { status: string }).status} />
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: unknown, row: unknown) => formatDate((row as { updatedAt: string }).updatedAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: unknown) => (
        <ActionMenu
          actions={[
            {
              label: 'View Details',
              onClick: () => handleRowClick(row)
            },
            {
              label: 'Validate',
              onClick: () => handleValidateProject((row as { id: string }).id)
            },
            {
              label: 'Reject',
              onClick: () => handleRejectProject((row as { id: string }).id),
              variant: 'destructive'
            },
            {
              label: 'Edit',
              onClick: () => handleEditProject((row as { id: string }).id)
            },
            {
              label: 'Duplicate',
              onClick: () => handleDuplicateProject((row as { id: string }).id)
            }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEPD FMR Project Evaluation</h1>
        <p className="text-muted-foreground">
          Evaluate Farm-to-Market Road (FMR) projects in proposal stage
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>FMR Project Filters</CardTitle>
          <CardDescription>Filter FMR projects for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search FMR projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                FMR Projects Only
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>FMR Projects Pending Evaluation ({filteredProjects.length})</CardTitle>
          <CardDescription>
            Farm-to-Market Road projects requiring SEPD evaluation
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
                FMR Project Evaluation - {selectedProject.title}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Review FMR project requirements and validate to proceed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">FMR Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> <Badge variant="secondary">FMR</Badge></div>
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

              {/* FMR Specific Requirements */}
              <div>
                <h4 className="font-medium mb-4">FMR Documentary Requirements Checklist</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">FMR Project Proposal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Road Design Plans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Traffic Impact Assessment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Community Consultation Report</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Environmental Clearance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Right-of-Way Documentation</span>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <h4 className="font-medium mb-2">FMR Project Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description}
                </p>
              </div>

              {/* FMR Specific Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Road Specifications</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Road Length: To be determined</div>
                    <div>• Road Width: Standard FMR width</div>
                    <div>• Surface Type: Concrete/Asphalt</div>
                    <div>• Drainage: Included</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Community Impact</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Beneficiary Communities: Multiple</div>
                    <div>• Agricultural Access: Improved</div>
                    <div>• Market Connectivity: Enhanced</div>
                    <div>• Economic Impact: Positive</div>
                  </div>
                </div>
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
                    handleValidateProject(selectedProject.id)
                    setShowEvaluationModal(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Requirements & Proceed
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
